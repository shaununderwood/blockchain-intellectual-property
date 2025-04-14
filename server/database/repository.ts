import { DatabaseService } from './plugin';
import { Envelope, EnvelopeStatus } from './schema';

// Initialize the database
export async function initializeDatabase(): Promise<void> {
  // Import dynamically to avoid ESM/CJS issues
  const { initializeDatabaseService } = await import('./plugin');
  const { initializeEnvelopeSchema } = await import('./schema');
  
  const db = initializeDatabaseService();
  await db.connect();
  await initializeEnvelopeSchema(db);
}

// SQLite implementation for envelope repository
export class SQLiteEnvelopeRepository {
  private db: DatabaseService;

  constructor(db: DatabaseService) {
    this.db = db;
  }

  // Get all envelopes
  async findAll(): Promise<Envelope[]> {
    return this.db.query<Envelope>('SELECT * FROM envelopes ORDER BY updated_at DESC');
  }

  // Get envelope by ID
  async findById(id: number): Promise<Envelope | null> {
    return this.db.getOne<Envelope>('SELECT * FROM envelopes WHERE id = ?', [id]);
  }

  // Create a new envelope
  async create(envelope: Omit<Envelope, 'id' | 'created_at' | 'updated_at'>): Promise<Envelope> {
    const { title, description, status, hash_value, algorithm, readme_content, blockchain_tx } = envelope;
    
    const sql = `
      INSERT INTO envelopes (
        title, description, status, hash_value, algorithm, readme_content, blockchain_tx
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.db.execute(sql, [
      title,
      description || null,
      status,
      hash_value || null,
      algorithm || null,
      readme_content || null,
      blockchain_tx || null
    ]);
    
    // Get the last inserted ID
    const result = await this.db.getOne<{ id: number }>('SELECT last_insert_rowid() as id');
    const id = result?.id;
    
    if (!id) {
      throw new Error('Failed to get inserted envelope ID');
    }
    
    // Return the created envelope
    return this.findById(id) as Promise<Envelope>;
  }

  // Update an envelope
  async update(id: number, updates: Partial<Envelope>): Promise<Envelope | null> {
    // Get the current envelope
    const envelope = await this.findById(id);
    
    if (!envelope) {
      return null;
    }
    
    // Build the update SQL dynamically based on provided fields
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    if (updates.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(updates.title);
    }
    
    if (updates.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(updates.description);
    }
    
    if (updates.status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(updates.status);
    }
    
    if (updates.hash_value !== undefined) {
      updateFields.push('hash_value = ?');
      updateValues.push(updates.hash_value);
    }
    
    if (updates.algorithm !== undefined) {
      updateFields.push('algorithm = ?');
      updateValues.push(updates.algorithm);
    }
    
    if (updates.readme_content !== undefined) {
      updateFields.push('readme_content = ?');
      updateValues.push(updates.readme_content);
    }
    
    if (updates.blockchain_tx !== undefined) {
      updateFields.push('blockchain_tx = ?');
      updateValues.push(updates.blockchain_tx);
    }
    
    // Always update the updated_at timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    
    // If there are no fields to update, return the current envelope
    if (updateFields.length === 1) {
      return envelope;
    }
    
    // Build and execute the update SQL
    const sql = `UPDATE envelopes SET ${updateFields.join(', ')} WHERE id = ?`;
    updateValues.push(id);
    
    await this.db.execute(sql, updateValues);
    
    // Return the updated envelope
    return this.findById(id);
  }

  // Delete an envelope
  async delete(id: number): Promise<boolean> {
    // Check if the envelope exists
    const envelope = await this.findById(id);
    
    if (!envelope) {
      return false;
    }
    
    // Delete the envelope
    await this.db.execute('DELETE FROM envelopes WHERE id = ?', [id]);
    
    return true;
  }
}

// Factory function to create an envelope repository
export function createEnvelopeRepository(db: DatabaseService): SQLiteEnvelopeRepository {
  return new SQLiteEnvelopeRepository(db);
}
