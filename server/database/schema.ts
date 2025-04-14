import { DatabaseService } from './plugin';

// Define the envelope status type
export type EnvelopeStatus = 'NEW' | 'HAS_FILES' | 'SEALED' | 'POSTED';

// Define the envelope schema interface
export interface Envelope {
  id?: number;
  title: string;
  description?: string;
  status: EnvelopeStatus;
  created_at?: string;
  updated_at?: string;
  hash_value?: string;
  algorithm?: string;
  readme_content?: string;
  blockchain_tx?: string;
}

// SQLite implementation for envelope schema
export class SQLiteEnvelopeSchema {
  private db: DatabaseService;

  constructor(db: DatabaseService) {
    this.db = db;
  }

  // Initialize the envelope table
  async initialize(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS envelopes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        hash_value TEXT,
        algorithm TEXT,
        readme_content TEXT,
        blockchain_tx TEXT
      )
    `;

    await this.db.execute(createTableSQL);
  }

  // Drop the envelope table (for testing purposes)
  async drop(): Promise<void> {
    await this.db.execute('DROP TABLE IF EXISTS envelopes');
  }
}

// Function to initialize the envelope schema
export async function initializeEnvelopeSchema(db: DatabaseService): Promise<SQLiteEnvelopeSchema> {
  const schema = new SQLiteEnvelopeSchema(db);
  await schema.initialize();
  return schema;
}
