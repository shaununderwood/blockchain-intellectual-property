import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Fix for ESM/CommonJS compatibility
const { Database } = sqlite3;

// Define the database interface that all plugins must implement
export interface IDatabasePlugin {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<void>;
  getOne<T>(sql: string, params?: any[]): Promise<T | null>;
}

// Define the database factory interface
export interface IDatabaseFactory {
  createDatabase(): IDatabasePlugin;
}

// Base abstract class for database plugins
export abstract class BaseDatabase implements IDatabasePlugin {
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract query<T>(sql: string, params?: any[]): Promise<T[]>;
  abstract execute(sql: string, params?: any[]): Promise<void>;
  abstract getOne<T>(sql: string, params?: any[]): Promise<T | null>;
}

// SQLite implementation of the database plugin
export class SQLiteDatabase extends BaseDatabase {
  private db: Database | null = null;
  private dbPath: string;

  constructor(dbPath?: string) {
    super();
    // If no path is provided, use a default path
    if (!dbPath) {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dbDir = path.join(__dirname, '../../data');
      
      // Ensure the directory exists
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      
      this.dbPath = path.join(dbDir, 'blockchain-ip.sqlite');
    } else {
      this.dbPath = dbPath;
    }
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }
      
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          this.db = null;
          resolve();
        }
      });
    });
  }

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not connected'));
        return;
      }
      
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }

  async execute(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not connected'));
        return;
      }
      
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getOne<T>(sql: string, params: any[] = []): Promise<T | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not connected'));
        return;
      }
      
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as T || null);
        }
      });
    });
  }
}

// Factory for creating SQLite database instances
export class SQLiteDatabaseFactory implements IDatabaseFactory {
  private dbPath?: string;
  
  constructor(dbPath?: string) {
    this.dbPath = dbPath;
  }
  
  createDatabase(): IDatabasePlugin {
    return new SQLiteDatabase(this.dbPath);
  }
}

// Database service that uses the plugin architecture
export class DatabaseService {
  private static instance: DatabaseService;
  private db: IDatabasePlugin;
  
  private constructor(dbFactory: IDatabaseFactory) {
    this.db = dbFactory.createDatabase();
  }
  
  public static getInstance(dbFactory: IDatabaseFactory): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(dbFactory);
    }
    return DatabaseService.instance;
  }
  
  async connect(): Promise<void> {
    await this.db.connect();
  }
  
  async disconnect(): Promise<void> {
    await this.db.disconnect();
  }
  
  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    return this.db.query<T>(sql, params);
  }
  
  async execute(sql: string, params?: any[]): Promise<void> {
    await this.db.execute(sql, params);
  }
  
  async getOne<T>(sql: string, params?: any[]): Promise<T | null> {
    return this.db.getOne<T>(sql, params);
  }
}

// Export a function to initialize the database service with SQLite
export function initializeDatabaseService(dbPath?: string): DatabaseService {
  const factory = new SQLiteDatabaseFactory(dbPath);
  return DatabaseService.getInstance(factory);
}
