import { H3Event, defineEventHandler, readBody, getRouterParam } from 'h3';
import { initializeDatabaseService } from '../../database/plugin';
import { createEnvelopeService } from '../../services/envelope.service';

// Initialize database and service
const db = initializeDatabaseService();
const envelopeService = createEnvelopeService(db);

// Connect to database when the server starts
db.connect().catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

// GET /api/envelopes - Get all envelopes
export default defineEventHandler(async (event: H3Event) => {
  try {
    const envelopes = await envelopeService.getAllEnvelopes();
    return {
      success: true,
      data: envelopes
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error getting all envelopes:', errorMessage);
    
    event.node.res.statusCode = 500;
    return {
      success: false,
      error: 'Internal server error',
      message: errorMessage
    };
  }
});
