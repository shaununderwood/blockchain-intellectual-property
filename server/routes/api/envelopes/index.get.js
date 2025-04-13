// API route for getting all envelopes
import { defineEventHandler } from 'h3';
import { getQuery as dbGetQuery, getSingleQuery } from '~/server/database';

export default defineEventHandler(() => {
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
      message: 'Failed to get envelopes: ' + error.message
    };
  }
});
