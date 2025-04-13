// API route for posting an envelope to blockchain
import { defineEventHandler, readBody } from 'h3';
import { runQuery, getSingleQuery } from '~/server/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../../../uploads');

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { envelopeId } = body;
    
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
        message: 'Envelope must be sealed before posting to blockchain'
      };
    }
    
    // Mock blockchain transaction
    const txId = 'tx_' + crypto.randomBytes(16).toString('hex');
    
    // Update envelope in database
    runQuery(
      'UPDATE envelopes SET status = ?, blockchain_tx = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['POSTED', txId, envelopeId]
    );
    
    // Rename zip file to remove "not-posted" suffix
    const envelopeDir = path.join(UPLOADS_DIR, `envelope-${envelopeId}`);
    const oldZipPath = path.join(envelopeDir, `${envelope.hash_value}-not-posted.zip`);
    const newZipPath = path.join(envelopeDir, `${envelope.hash_value}.zip`);
    
    if (fs.existsSync(oldZipPath)) {
      fs.renameSync(oldZipPath, newZipPath);
    }
    
    return {
      success: true,
      txId,
      message: 'Envelope posted to blockchain successfully'
    };
  } catch (error) {
    console.error('Error posting to blockchain:', error);
    return {
      success: false,
      message: 'Failed to post envelope to blockchain: ' + error.message
    };
  }
});
