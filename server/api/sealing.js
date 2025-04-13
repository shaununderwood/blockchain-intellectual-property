// Envelope sealing and unsealing API routes
import { defineEventHandler, readBody, getQuery } from 'h3';
import { runQuery, getQuery as dbGetQuery, getSingleQuery } from '~/server/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import archiver from 'archiver';
import { promisify } from 'util';
import { pipeline } from 'stream';

const pipelineAsync = promisify(pipeline);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Seal an envelope
export const sealEnvelope = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { envelopeId, algorithm } = body;
    
    if (!envelopeId || !algorithm) {
      return {
        success: false,
        message: 'Envelope ID and hashing algorithm are required'
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
    
    // Get files
    const files = dbGetQuery('SELECT * FROM files WHERE envelope_id = ?', [envelopeId]);
    
    if (files.length === 0) {
      return {
        success: false,
        message: 'Envelope has no files to seal'
      };
    }
    
    // Create envelope directory if it doesn't exist
    const envelopeDir = path.join(UPLOADS_DIR, `envelope-${envelopeId}`);
    if (!fs.existsSync(envelopeDir)) {
      fs.mkdirSync(envelopeDir, { recursive: true });
    }
    
    // Update README with algorithm info
    let readmeContent = envelope.readme_content;
    readmeContent += `\n## Hashing Information\n\nAlgorithm: ${algorithm}\n`;
    
    // Update README.md file
    const readmePath = path.join(envelopeDir, 'README.md');
    fs.writeFileSync(readmePath, readmeContent);
    
    // Create zip file
    const zipPath = path.join(envelopeDir, 'envelope.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Compression level
    });
    
    archive.pipe(output);
    
    // Add README.md to zip
    archive.file(readmePath, { name: 'README.md' });
    
    // Add all files to zip
    for (const file of files) {
      if (fs.existsSync(file.file_path)) {
        archive.file(file.file_path, { name: file.filename });
      }
    }
    
    await archive.finalize();
    
    // Wait for the zip to be fully written
    await new Promise((resolve) => {
      output.on('close', resolve);
    });
    
    // Generate hash from zip file
    const zipContent = fs.readFileSync(zipPath);
    const hash = crypto.createHash(algorithm.toLowerCase()).update(zipContent).digest('hex');
    
    // Rename zip file to include hash
    const hashZipPath = path.join(envelopeDir, `${hash}-not-posted.zip`);
    fs.renameSync(zipPath, hashZipPath);
    
    // Update envelope in database
    runQuery(
      'UPDATE envelopes SET status = ?, hash_value = ?, algorithm = ?, readme_content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['SEALED', hash, algorithm, readmeContent, envelopeId]
    );
    
    return {
      success: true,
      hash,
      algorithm,
      zipPath: hashZipPath,
      message: 'Envelope sealed successfully'
    };
  } catch (error) {
    console.error('Error sealing envelope:', error);
    return {
      success: false,
      message: 'Failed to seal envelope'
    };
  }
});

// Unseal an envelope
export const unsealEnvelope = defineEventHandler(async (event) => {
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
      message: 'Failed to unseal envelope'
    };
  }
});

// Download sealed envelope
export const downloadSealedEnvelope = defineEventHandler((event) => {
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
      message: 'Failed to download sealed envelope'
    };
  }
});

// Post envelope to blockchain (mock implementation)
export const postToBlockchain = defineEventHandler(async (event) => {
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
      message: 'Failed to post envelope to blockchain'
    };
  }
});
