// API route for creating envelopes
import { defineEventHandler, readBody } from 'h3';
import { runQuery } from '~/server/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { title, description } = body;
    
    if (!title) {
      return {
        success: false,
        message: 'Title is required'
      };
    }
    
    // Create README.md content
    const readmeContent = `# ${title}\n\n${description || ''}\n\n## Manifest\n\n`;
    
    // Insert envelope into database
    const result = runQuery(
      'INSERT INTO envelopes (title, description, status, readme_content) VALUES (?, ?, ?, ?)',
      [title, description, 'NEW', readmeContent]
    );
    
    const envelopeId = result.lastInsertRowid;
    
    // Create envelope directory
    const envelopeDir = path.join(UPLOADS_DIR, `envelope-${envelopeId}`);
    if (!fs.existsSync(envelopeDir)) {
      fs.mkdirSync(envelopeDir, { recursive: true });
    }
    
    // Write README.md file
    fs.writeFileSync(path.join(envelopeDir, 'README.md'), readmeContent);
    
    return {
      success: true,
      envelopeId,
      title,
      description,
      status: 'NEW'
    };
  } catch (error) {
    console.error('Error creating envelope:', error);
    return {
      success: false,
      message: 'Failed to create envelope: ' + error.message
    };
  }
});
