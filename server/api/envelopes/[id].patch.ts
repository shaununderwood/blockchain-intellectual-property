import { H3Event, defineEventHandler, readBody, getRouterParam } from 'h3';
import { initializeDatabaseService } from '../../database/plugin';
import { createEnvelopeService } from '../../services/envelope.service';

// Initialize database and service
const db = initializeDatabaseService();
const envelopeService = createEnvelopeService(db);

// PATCH /api/envelopes/:id - Update an envelope
export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get the ID from the URL parameter
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      event.node.res.statusCode = 400;
      return {
        success: false,
        error: 'Bad Request',
        message: 'Envelope ID is required'
      };
    }
    
    // Convert ID to number
    const envelopeId = parseInt(id, 10);
    
    if (isNaN(envelopeId)) {
      event.node.res.statusCode = 400;
      return {
        success: false,
        error: 'Bad Request',
        message: 'Invalid envelope ID format'
      };
    }
    
    // Read the request body
    const body = await readBody(event);
    
    // Validate that at least one field is provided
    if (body.title === undefined && body.description === undefined) {
      event.node.res.statusCode = 400;
      return {
        success: false,
        error: 'Bad Request',
        message: 'At least one field (title or description) must be provided'
      };
    }
    
    // Update the envelope
    const updatedEnvelope = await envelopeService.updateEnvelope(envelopeId, {
      title: body.title,
      description: body.description
    });
    
    if (!updatedEnvelope) {
      event.node.res.statusCode = 404;
      return {
        success: false,
        error: 'Not Found',
        message: `Envelope with ID ${envelopeId} not found`
      };
    }
    
    return {
      success: true,
      data: updatedEnvelope
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error updating envelope:', errorMessage);
    
    event.node.res.statusCode = 500;
    return {
      success: false,
      error: 'Internal Server Error',
      message: errorMessage
    };
  }
});
