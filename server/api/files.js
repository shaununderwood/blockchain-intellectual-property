// File management API routes
import { defineEventHandler, readBody, getQuery } from 'h3';
import { runQuery, getQuery as dbGetQuery, getSingleQuery } from '~/server/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import formidable from 'formidable';
import { createReadStream, createWriteStream } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Upload files to an envelope
export const uploadFiles = defineEventHandler(async (event) => {
  try {
    const form = formidable({
      multiples: true,
      uploadDir: UPLOADS_DIR,
      keepExtensions: true,
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const envelopeId = fields.envelopeId[0];
    
    if (!envelopeId) {
      return {
        success: false,
        message: 'Envelope ID is required'
      };
    }

    // Get envelope
    const envelope = getSingleQuery('SELECT * FROM envelopes WHERE id = ?', [envelopeId]);
    
    if (!envelope) {
      return {
        success: false,
        message: 'Envelope not found'
      };
    }

    // Create envelope directory if it doesn't exist
    const envelopeDir = path.join(UPLOADS_DIR, `envelope-${envelopeId}`);
    if (!fs.existsSync(envelopeDir)) {
      fs.mkdirSync(envelopeDir, { recursive: true });
    }

    // Process uploaded files
    const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];
    const savedFiles = [];

    for (const file of uploadedFiles) {
      const fileName = file.originalFilename;
      const filePath = path.join(envelopeDir, fileName);
      
      // Move file to envelope directory
      fs.renameSync(file.filepath, filePath);
      
      // Save file info to database
      const result = runQuery(
        'INSERT INTO files (envelope_id, filename, file_path, file_size, file_type) VALUES (?, ?, ?, ?, ?)',
        [envelopeId, fileName, filePath, file.size, file.mimetype]
      );
      
      savedFiles.push({
        id: result.lastInsertRowid,
        filename: fileName,
        file_size: file.size,
        file_type: file.mimetype
      });
      
      // Update README.md with file info
      updateReadmeWithFile(envelopeId, fileName);
    }

    // Update envelope status if it was NEW
    if (envelope.status === 'NEW') {
      runQuery(
        'UPDATE envelopes SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['HAS_FILES', envelopeId]
      );
    }

    return {
      success: true,
      files: savedFiles,
      message: 'Files uploaded successfully'
    };
  } catch (error) {
    console.error('Error uploading files:', error);
    return {
      success: false,
      message: 'Failed to upload files'
    };
  }
});

// Remove a file from an envelope
export const removeFile = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { fileId, envelopeId } = body;
    
    if (!fileId || !envelopeId) {
      return {
        success: false,
        message: 'File ID and Envelope ID are required'
      };
    }
    
    // Get file info
    const file = getSingleQuery('SELECT * FROM files WHERE id = ? AND envelope_id = ?', [fileId, envelopeId]);
    
    if (!file) {
      return {
        success: false,
        message: 'File not found'
      };
    }
    
    // Delete file from filesystem
    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }
    
    // Delete file from database
    runQuery('DELETE FROM files WHERE id = ?', [fileId]);
    
    // Remove file from README.md
    removeFileFromReadme(envelopeId, file.filename);
    
    // Check if envelope has any files left
    const fileCount = getSingleQuery(
      'SELECT COUNT(*) as count FROM files WHERE envelope_id = ?',
      [envelopeId]
    ).count;
    
    // Update envelope status if no files left
    if (fileCount === 0) {
      runQuery(
        'UPDATE envelopes SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['NEW', envelopeId]
      );
    }
    
    return {
      success: true,
      message: 'File removed successfully'
    };
  } catch (error) {
    console.error('Error removing file:', error);
    return {
      success: false,
      message: 'Failed to remove file'
    };
  }
});

// Helper function to update README.md with file info
function updateReadmeWithFile(envelopeId, fileName) {
  try {
    const envelope = getSingleQuery('SELECT * FROM envelopes WHERE id = ?', [envelopeId]);
    const readmePath = path.join(UPLOADS_DIR, `envelope-${envelopeId}`, 'README.md');
    
    let readmeContent = envelope.readme_content;
    
    // Add file to manifest if not already there
    if (!readmeContent.includes(`- ${fileName}`)) {
      readmeContent += `- ${fileName}\n`;
      
      // Update README.md file
      fs.writeFileSync(readmePath, readmeContent);
      
      // Update envelope in database
      runQuery(
        'UPDATE envelopes SET readme_content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [readmeContent, envelopeId]
      );
    }
  } catch (error) {
    console.error('Error updating README with file:', error);
  }
}

// Helper function to remove file from README.md
function removeFileFromReadme(envelopeId, fileName) {
  try {
    const envelope = getSingleQuery('SELECT * FROM envelopes WHERE id = ?', [envelopeId]);
    const readmePath = path.join(UPLOADS_DIR, `envelope-${envelopeId}`, 'README.md');
    
    let readmeContent = envelope.readme_content;
    
    // Remove file from manifest
    readmeContent = readmeContent.replace(`- ${fileName}\n`, '');
    
    // Update README.md file
    fs.writeFileSync(readmePath, readmeContent);
    
    // Update envelope in database
    runQuery(
      'UPDATE envelopes SET readme_content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [readmeContent, envelopeId]
    );
  } catch (error) {
    console.error('Error removing file from README:', error);
  }
}
