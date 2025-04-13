// API route for sealing an envelope
import { defineEventHandler, readBody } from 'h3';
import { runQuery, getSingleQuery } from '~/server/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import archiver from 'archiver';
import { promisify } from 'util';
import { pipeline } from 'stream';

const pipelineAsync = promisify(pipeline);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../../../uploads');

export default defineEventHandler(async (event) => {
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
      message: 'Failed to seal envelope: ' + error.message
    };
  }
});
