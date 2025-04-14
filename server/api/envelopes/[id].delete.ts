import { H3Event, defineEventHandler, getRouterParam } from 'h3';
import { initializeDatabaseService } from '../../database/plugin';
import { createEnvelopeService } from '../../services/envelope.service';

// Initialize database and service
const db = initializeDatabaseService();
const envelopeService = createEnvelopeService(db);

// DELETE /api/envelopes/:id - Delete an envelope
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
    
    // Delete the envelope
    const deleted = await envelopeService.deleteEnvelope(envelopeId);
    
    if (!deleted) {
      event.node.res.statusCode = 404;
      return {
        success: false,
        error: 'Not Found',
        message: `Envelope with ID ${envelopeId} not found`
      };
    }
    
    // Return 204 No Content status code
    event.node.res.statusCode = 204;
    
    return {
      success: true,
      message: `Envelope with ID ${envelopeId} deleted successfully`
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error deleting envelope:', errorMessage);
    
    event.node.res.statusCode = 500;
    return {
      success: false,
      error: 'Internal Server Error',
      message: errorMessage
    };
  }
});
