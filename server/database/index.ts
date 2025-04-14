import { initializeDatabaseService } from './plugin';
import { initializeEnvelopeSchema } from './schema';

// Initialize the database and schema
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('Initializing database...');
    const db = initializeDatabaseService();
    await db.connect();
    await initializeEnvelopeSchema(db);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Initialize the database when the server starts
export default async () => {
  await initializeDatabase();
};
