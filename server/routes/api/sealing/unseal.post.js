// API route for unsealing an envelope
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
        message: 'Envelope is not sealed'
      };
    }
    
    // Remove hash information from README
    let readmeContent = envelope.readme_content;
    readmeContent = readmeContent.replace(/\n## Hashing Information\n\nAlgorithm: .*\n/, '');
    
    // Update README.md file
    const readmePath = path.join(UPLOADS_DIR, `envelope-${envelopeId}`, 'README.md');
    fs.writeFileSync(readmePath, readmeContent);
    
    // Delete zip file if it exists
    const envelopeDir = path.join(UPLOADS_DIR, `envelope-${envelopeId}`);
    const hashZipPath = path.join(envelopeDir, `${envelope.hash_value}-not-posted.zip`);
    if (fs.existsSync(hashZipPath)) {
      fs.unlinkSync(hashZipPath);
    }
    
    // Update envelope in database
    runQuery(
      'UPDATE envelopes SET status = ?, hash_value = NULL, algorithm = NULL, readme_content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['HAS_FILES', readmeContent, envelopeId]
    );
    
    return {
      success: true,
      message: 'Envelope unsealed successfully'
    };
  } catch (error) {
    console.error('Error unsealing envelope:', error);
    return {
      success: false,
      message: 'Failed to unseal envelope: ' + error.message
    };
  }
});
