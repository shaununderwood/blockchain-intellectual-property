// API route for removing files
import { defineEventHandler, readBody } from 'h3';
import { runQuery, getQuery as dbGetQuery, getSingleQuery } from '~/server/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../../../uploads');

export default defineEventHandler(async (event) => {
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
      message: 'Failed to remove file: ' + error.message
    };
  }
});

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
