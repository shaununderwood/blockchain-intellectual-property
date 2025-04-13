// API route for downloading a sealed envelope
import { defineEventHandler, getQuery } from 'h3';
import { getSingleQuery } from '~/server/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../../../uploads');

export default defineEventHandler((event) => {
  try {
    const query = getQuery(event);
    const { envelopeId } = query;
    
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
    
    if (envelope.status !== 'SEALED') {
      return {
        success: false,
        message: 'Envelope is not sealed'
      };
    }
    
    const zipPath = path.join(UPLOADS_DIR, `envelope-${envelopeId}`, `${envelope.hash_value}-not-posted.zip`);
    
    if (!fs.existsSync(zipPath)) {
      return {
        success: false,
        message: 'Sealed envelope file not found'
      };
    }
    
    // Return file path for download
    return {
      success: true,
      filePath: zipPath,
      fileName: `${envelope.hash_value}-not-posted.zip`
    };
  } catch (error) {
    console.error('Error downloading sealed envelope:', error);
    return {
      success: false,
      message: 'Failed to download sealed envelope: ' + error.message
    };
  }
});
