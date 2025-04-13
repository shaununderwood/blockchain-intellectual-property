// API route for file uploads
import { defineEventHandler, readMultipartFormData } from 'h3';
import { runQuery, getQuery as dbGetQuery, getSingleQuery } from '~/server/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    if (!formData) {
      return {
        success: false,
        message: 'No form data received'
      };
    }

    // Extract envelope ID from form data
    const envelopeIdField = formData.find(field => field.name === 'envelopeId');
    if (!envelopeIdField) {
      return {
        success: false,
        message: 'Envelope ID is required'
      };
    }
    
    const envelopeId = envelopeIdField.data.toString();
    
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
    const fileFields = formData.filter(field => field.name === 'files');
    const savedFiles = [];

    for (const fileField of fileFields) {
      const fileName = fileField.filename;
      const filePath = path.join(envelopeDir, fileName);
      
      // Write file to envelope directory
      fs.writeFileSync(filePath, fileField.data);
      
      // Save file info to database
      const result = runQuery(
        'INSERT INTO files (envelope_id, filename, file_path, file_size, file_type) VALUES (?, ?, ?, ?, ?)',
        [envelopeId, fileName, filePath, fileField.data.length, fileField.type || 'application/octet-stream']
      );
      
      savedFiles.push({
        id: result.lastInsertRowid,
        filename: fileName,
        file_size: fileField.data.length,
        file_type: fileField.type || 'application/octet-stream'
      });
      
      // Update README.md with file info
      updateReadmeWithFile(envelopeId, fileName);
    }

    // Update envelope status if it was NEW
    if (envelope.status === 'NEW' && savedFiles.length > 0) {
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
      message: 'Failed to upload files: ' + error.message
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
