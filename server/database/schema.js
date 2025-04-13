// Database schema design for envelope management
const envelopeSchema = {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  title: 'TEXT NOT NULL',
  description: 'TEXT',
  status: 'TEXT NOT NULL', // NEW, HAS_FILES, SEALED, POSTED
  created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  hash_value: 'TEXT',
  algorithm: 'TEXT',
  readme_content: 'TEXT',
  blockchain_tx: 'TEXT', // For storing transaction ID when posted to blockchain
};

const fileSchema = {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  envelope_id: 'INTEGER NOT NULL',
  filename: 'TEXT NOT NULL',
  file_path: 'TEXT NOT NULL',
  file_size: 'INTEGER',
  file_type: 'TEXT',
  created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  FOREIGN_KEY: '(envelope_id) REFERENCES envelopes(id) ON DELETE CASCADE'
};
