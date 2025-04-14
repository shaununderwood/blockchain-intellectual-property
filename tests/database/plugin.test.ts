import { SQLiteDatabase, IDatabasePlugin } from '../../server/database/plugin';
import { SQLiteEnvelopeSchema } from '../../server/database/schema';

// Mock the sqlite3 Database
jest.mock('sqlite3', () => {
  return {
    Database: jest.fn().mockImplementation(() => {
      return {
        all: jest.fn((sql, params, callback) => callback(null, [])),
        get: jest.fn((sql, params, callback) => callback(null, null)),
        run: jest.fn(function(sql, params, callback) {
          if (callback) callback(null);
          return this;
        }),
        close: jest.fn((callback) => callback(null))
      };
    })
  };
});

describe('SQLiteDatabase', () => {
  let db: IDatabasePlugin;
  
  beforeEach(() => {
    // Create a new instance for each test
    db = new SQLiteDatabase(':memory:');
  });
  
  afterEach(async () => {
    // Disconnect after each test
    await db.disconnect();
  });
  
  describe('connect', () => {
    it('should connect to the database', async () => {
      // Act
      await db.connect();
      
      // Assert - no error means success
      expect(true).toBe(true);
    });
  });
  
  describe('query', () => {
    it('should execute a query and return results', async () => {
      // Arrange
      await db.connect();
      
      // Act
      const results = await db.query('SELECT * FROM test');
      
      // Assert
      expect(results).toEqual([]);
    });
    
    it('should throw an error if not connected', async () => {
      // Act & Assert
      await expect(db.query('SELECT * FROM test')).rejects.toThrow('Database not connected');
    });
  });
  
  describe('getOne', () => {
    it('should execute a query and return a single result', async () => {
      // Arrange
      await db.connect();
      
      // Act
      const result = await db.getOne('SELECT * FROM test WHERE id = ?', [1]);
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('should throw an error if not connected', async () => {
      // Act & Assert
      await expect(db.getOne('SELECT * FROM test WHERE id = ?', [1])).rejects.toThrow('Database not connected');
    });
  });
  
  describe('execute', () => {
    it('should execute a statement', async () => {
      // Arrange
      await db.connect();
      
      // Act
      await db.execute('CREATE TABLE test (id INTEGER PRIMARY KEY)');
      
      // Assert - no error means success
      expect(true).toBe(true);
    });
    
    it('should throw an error if not connected', async () => {
      // Act & Assert
      await expect(db.execute('CREATE TABLE test (id INTEGER PRIMARY KEY)')).rejects.toThrow('Database not connected');
    });
  });
});

describe('SQLiteEnvelopeSchema', () => {
  // Mock database service
  const mockDb = {
    execute: jest.fn(),
    query: jest.fn(),
    getOne: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn()
  };
  
  let schema: SQLiteEnvelopeSchema;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create schema instance
    schema = new SQLiteEnvelopeSchema(mockDb as any);
  });
  
  describe('initialize', () => {
    it('should create the envelopes table if it does not exist', async () => {
      // Act
      await schema.initialize();
      
      // Assert
      expect(mockDb.execute).toHaveBeenCalledTimes(1);
      expect(mockDb.execute).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS envelopes'));
    });
  });
  
  describe('drop', () => {
    it('should drop the envelopes table', async () => {
      // Act
      await schema.drop();
      
      // Assert
      expect(mockDb.execute).toHaveBeenCalledTimes(1);
      expect(mockDb.execute).toHaveBeenCalledWith('DROP TABLE IF EXISTS envelopes');
    });
  });
});
