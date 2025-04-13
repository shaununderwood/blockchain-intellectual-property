// Envelope API routes
import { defineEventHandler, readBody, getQuery } from 'h3';
import { runQuery, getQuery as dbGetQuery, getSingleQuery } from '~/server/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Create a new envelope
export const createEnvelope = defineEventHandler(async (event) => {
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
      message: 'Failed to create envelope'
    };
  }
});

// Get all envelopes
export const getEnvelopes = defineEventHandler(() => {
  try {
    const envelopes = dbGetQuery('SELECT * FROM envelopes ORDER BY updated_at DESC');
    
    // Get file count for each envelope
    const envelopesWithFileCount = envelopes.map(envelope => {
      const fileCount = getSingleQuery(
        'SELECT COUNT(*) as count FROM files WHERE envelope_id = ?',
        [envelope.id]
      ).count;
      
      return {
        ...envelope,
        fileCount
      };
    });
    
    return {
      success: true,
      envelopes: envelopesWithFileCount
    };
  } catch (error) {
    console.error('Error getting envelopes:', error);
    return {
      success: false,
      message: 'Failed to get envelopes'
    };
  }
});

// Get a single envelope with its files
export const getEnvelope = defineEventHandler((event) => {
  try {
    const query = getQuery(event);
    const { id } = query;
    
    if (!id) {
      return {
        success: false,
        message: 'Envelope ID is required'
      };
    }
    
    const envelope = getSingleQuery('SELECT * FROM envelopes WHERE id = ?', [id]);
    
    if (!envelope) {
      return {
        success: false,
        message: 'Envelope not found'
      };
    }
    
    const files = dbGetQuery('SELECT * FROM files WHERE envelope_id = ?', [id]);
    
    return {
      success: true,
      envelope: {
        ...envelope,
        files
      }
    };
  } catch (error) {
    console.error('Error getting envelope:', error);
    return {
      success: false,
      message: 'Failed to get envelope'
    };
  }
});

// Delete an envelope
export const deleteEnvelope = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id } = body;
    
    if (!id) {
      return {
        success: false,
        message: 'Envelope ID is required'
      };
    }
    
    // Delete envelope directory
    const envelopeDir = path.join(UPLOADS_DIR, `envelope-${id}`);
    if (fs.existsSync(envelopeDir)) {
      fs.rmSync(envelopeDir, { recursive: true, force: true });
    }
    
    // Delete from database
    runQuery('DELETE FROM envelopes WHERE id = ?', [id]);
    
    return {
      success: true,
      message: 'Envelope deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting envelope:', error);
    return {
      success: false,
      message: 'Failed to delete envelope'
    };
  }
});

// Update envelope status
export const updateEnvelopeStatus = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, status } = body;
    
    if (!id || !status) {
      return {
        success: false,
        message: 'Envelope ID and status are required'
      };
    }
    
    runQuery(
      'UPDATE envelopes SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
    
    return {
      success: true,
      message: 'Envelope status updated successfully'
    };
  } catch (error) {
    console.error('Error updating envelope status:', error);
    return {
      success: false,
      message: 'Failed to update envelope status'
    };
  }
});
