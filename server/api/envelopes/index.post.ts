import { H3Event, defineEventHandler, readBody } from 'h3';
import { initializeDatabaseService } from '../../database/plugin';
import { createEnvelopeService } from '../../services/envelope.service';

// Initialize database and service
const db = initializeDatabaseService();
const envelopeService = createEnvelopeService(db);

// POST /api/envelopes - Create a new envelope
export default defineEventHandler(async (event: H3Event) => {
  try {
    // Read the request body
    const body = await readBody(event);
    
    // Validate required fields
    if (!body.title) {
      event.node.res.statusCode = 400;
      return {
        success: false,
        error: 'Bad Request',
        message: 'Title is required'
      };
    }
    
    // Create the envelope
    const envelope = await envelopeService.createEnvelope({
      title: body.title,
      description: body.description
    });
    
    // Return 201 Created status code
    event.node.res.statusCode = 201;
    
    return {
      success: true,
      data: envelope
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error creating envelope:', errorMessage);
    
    event.node.res.statusCode = 500;
    return {
      success: false,
      error: 'Internal Server Error',
      message: errorMessage
    };
  }
});
