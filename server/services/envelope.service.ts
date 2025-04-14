import { DatabaseService } from '../database/plugin';
import { SQLiteEnvelopeRepository, createEnvelopeRepository } from '../database/repository';
import { Envelope, EnvelopeStatus } from '../database/schema';

// Interface for the envelope service
export interface IEnvelopeService {
  getAllEnvelopes(): Promise<Envelope[]>;
  getEnvelopeById(id: number): Promise<Envelope | null>;
  createEnvelope(data: { title: string; description?: string }): Promise<Envelope>;
  updateEnvelope(id: number, data: { title?: string; description?: string }): Promise<Envelope | null>;
  deleteEnvelope(id: number): Promise<boolean>;
}

// Envelope service implementation
export class EnvelopeService implements IEnvelopeService {
  private repository: SQLiteEnvelopeRepository;

  constructor(repository: SQLiteEnvelopeRepository) {
    this.repository = repository;
  }

  // Get all envelopes
  async getAllEnvelopes(): Promise<Envelope[]> {
    return this.repository.findAll();
  }

  // Get envelope by ID
  async getEnvelopeById(id: number): Promise<Envelope | null> {
    return this.repository.findById(id);
  }

  // Create a new envelope
  async createEnvelope(data: { title: string; description?: string }): Promise<Envelope> {
    const { title, description } = data;
    
    // Validate title
    if (!title || title.trim() === '') {
      throw new Error('Title is required');
    }
    
    // Create a new envelope with initial status NEW
    const envelope: Omit<Envelope, 'id' | 'created_at' | 'updated_at'> = {
      title,
      description,
      status: 'NEW' as EnvelopeStatus,
      readme_content: `# ${title}\n\n${description || ''}\n\n## Manifest\n\n`
    };
    
    return this.repository.create(envelope);
  }

  // Update an envelope
  async updateEnvelope(id: number, data: { title?: string; description?: string }): Promise<Envelope | null> {
    const { title, description } = data;
    
    // Validate that at least one field is provided
    if (title === undefined && description === undefined) {
      throw new Error('At least one field (title or description) must be provided');
    }
    
    // Validate title if provided
    if (title !== undefined && title.trim() === '') {
      throw new Error('Title cannot be empty');
    }
    
    // Only update title and description as specified in requirements
    const updates: Partial<Envelope> = {};
    
    if (title !== undefined) {
      updates.title = title;
    }
    
    if (description !== undefined) {
      updates.description = description;
    }
    
    return this.repository.update(id, updates);
  }

  // Delete an envelope
  async deleteEnvelope(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}

// Factory function to create an envelope service
export function createEnvelopeService(db: DatabaseService): EnvelopeService {
  const repository = createEnvelopeRepository(db);
  return new EnvelopeService(repository);
}

// Export a singleton instance for use in the application
let envelopeServiceInstance: EnvelopeService | null = null;

export async function getEnvelopeService(): Promise<EnvelopeService> {
  if (!envelopeServiceInstance) {
    // Import dynamically to avoid circular dependencies
    const { initializeDatabaseService } = await import('../database/plugin');
    const db = initializeDatabaseService();
    await db.connect();
    envelopeServiceInstance = createEnvelopeService(db);
  }
  
  return envelopeServiceInstance;
}
