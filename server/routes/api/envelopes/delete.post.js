// API route for deleting an envelope
import { defineEventHandler, readBody } from 'h3';
import { runQuery, getSingleQuery } from '~/server/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../../../uploads');

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id } = body;
    
    if (!id) {
      return {
        success: false,
        message: 'Envelope ID is required'
      };
    }
    
    // Check if envelope exists
    const envelope = getSingleQuery('SELECT * FROM envelopes WHERE id = ?', [id]);
    if (!envelope) {
      return {
        success: false,
        message: 'Envelope not found'
      };
    }
    
    // Delete envelope directory
    const envelopeDir = path.join(UPLOADS_DIR, `envelope-${id}`);
    if (fs.existsSync(envelopeDir)) {
      fs.rmSync(envelopeDir, { recursive: true, force: true });
    }
    
    // Delete from database (cascade will delete related files)
    runQuery('DELETE FROM envelopes WHERE id = ?', [id]);
    
    return {
      success: true,
      message: 'Envelope deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting envelope:', error);
    return {
      success: false,
      message: 'Failed to delete envelope: ' + error.message
    };
  }
});
