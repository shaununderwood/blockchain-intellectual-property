// Download file route handler
import { defineEventHandler, getQuery, sendStream } from 'h3';
import { createReadStream } from 'fs';
import path from 'path';
import fs from 'fs';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const filePath = query.path;
  
  if (!filePath) {
    return {
      success: false,
      message: 'File path is required'
    };
  }
  
  // Security check to prevent directory traversal
  const normalizedPath = path.normalize(filePath);
  if (normalizedPath.includes('..')) {
    return {
      success: false,
      message: 'Invalid file path'
    };
  }
  
  // Check if file exists
  if (!fs.existsSync(normalizedPath)) {
    return {
      success: false,
      message: 'File not found'
    };
  }
  
  // Get file name from path
  const fileName = path.basename(normalizedPath);
  
  // Set headers for file download
  event.node.res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  event.node.res.setHeader('Content-Type', 'application/octet-stream');
  
  // Stream file to response
  return sendStream(event, createReadStream(normalizedPath));
});
