// Database initialization and connection utilities
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sqlite3 = require('better-sqlite3');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../data/envelopes.sqlite');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database connection
export function getDbConnection() {
  const db = sqlite3(DB_PATH);
  return db;
}

// Initialize database tables
export function initializeDatabase() {
  const db = getDbConnection();
  
  // Create envelopes table
  db.exec(`
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
  `);
  
  // Create files table
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      envelope_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER,
      file_type TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (envelope_id) REFERENCES envelopes(id) ON DELETE CASCADE
    )
  `);
  
  db.close();
  console.log('Database initialized successfully');
  return true;
}

// Helper function to run database queries
export function runQuery(query, params = []) {
  const db = getDbConnection();
  try {
    const stmt = db.prepare(query);
    const result = stmt.run(params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Helper function to get data from database
export function getQuery(query, params = []) {
  const db = getDbConnection();
  try {
    const stmt = db.prepare(query);
    const result = stmt.all(params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Helper function to get a single row from database
export function getSingleQuery(query, params = []) {
  const db = getDbConnection();
  try {
    const stmt = db.prepare(query);
    const result = stmt.get(params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Initialize database on import
initializeDatabase();
