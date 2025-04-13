// API route for getting a single envelope with its files
import { defineEventHandler } from 'h3';
import { getSingleQuery, getQuery as dbGetQuery } from '~/server/database';

export default defineEventHandler((event) => {
  try {
    const { id } = event.context.params;
    
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
      message: 'Failed to get envelope: ' + error.message
    };
  }
});
