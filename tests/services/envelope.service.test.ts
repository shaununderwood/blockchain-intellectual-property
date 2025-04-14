import { EnvelopeService } from '../../server/services/envelope.service';
import { Envelope, EnvelopeStatus } from '../../server/database/schema';

// Mock repository
const mockRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

// Create service with mock repository
const envelopeService = new EnvelopeService(mockRepository as any);

describe('EnvelopeService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllEnvelopes', () => {
    it('should return all envelopes', async () => {
      // Arrange
      const mockEnvelopes: Envelope[] = [
        { id: 1, title: 'Envelope 1', status: 'NEW' as EnvelopeStatus },
        { id: 2, title: 'Envelope 2', status: 'HAS_FILES' as EnvelopeStatus }
      ];
      mockRepository.findAll.mockResolvedValue(mockEnvelopes);

      // Act
      const result = await envelopeService.getAllEnvelopes();

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockEnvelopes);
    });

    it('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      mockRepository.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(envelopeService.getAllEnvelopes()).rejects.toThrow('Database error');
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEnvelopeById', () => {
    it('should return envelope by id', async () => {
      // Arrange
      const mockEnvelope: Envelope = { id: 1, title: 'Envelope 1', status: 'NEW' as EnvelopeStatus };
      mockRepository.findById.mockResolvedValue(mockEnvelope);

      // Act
      const result = await envelopeService.getEnvelopeById(1);

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEnvelope);
    });

    it('should return null if envelope not found', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act
      const result = await envelopeService.getEnvelopeById(999);

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('createEnvelope', () => {
    it('should create a new envelope', async () => {
      // Arrange
      const envelopeData = { title: 'New Envelope', description: 'Test description' };
      const createdEnvelope: Envelope = {
        id: 1,
        title: 'New Envelope',
        description: 'Test description',
        status: 'NEW' as EnvelopeStatus,
        readme_content: '# New Envelope\n\nTest description\n\n## Manifest\n\n'
      };
      mockRepository.create.mockResolvedValue(createdEnvelope);

      // Act
      const result = await envelopeService.createEnvelope(envelopeData);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith({
        title: 'New Envelope',
        description: 'Test description',
        status: 'NEW',
        readme_content: '# New Envelope\n\nTest description\n\n## Manifest\n\n'
      });
      expect(result).toEqual(createdEnvelope);
    });

    it('should throw error if title is empty', async () => {
      // Arrange
      const envelopeData = { title: '', description: 'Test description' };

      // Act & Assert
      await expect(envelopeService.createEnvelope(envelopeData)).rejects.toThrow('Title is required');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateEnvelope', () => {
    it('should update an envelope', async () => {
      // Arrange
      const updateData = { title: 'Updated Title' };
      const updatedEnvelope: Envelope = {
        id: 1,
        title: 'Updated Title',
        status: 'NEW' as EnvelopeStatus
      };
      mockRepository.update.mockResolvedValue(updatedEnvelope);

      // Act
      const result = await envelopeService.updateEnvelope(1, updateData);

      // Assert
      expect(mockRepository.update).toHaveBeenCalledWith(1, { title: 'Updated Title' });
      expect(result).toEqual(updatedEnvelope);
    });

    it('should return null if envelope not found', async () => {
      // Arrange
      mockRepository.update.mockResolvedValue(null);

      // Act
      const result = await envelopeService.updateEnvelope(999, { title: 'Updated Title' });

      // Assert
      expect(mockRepository.update).toHaveBeenCalledWith(999, { title: 'Updated Title' });
      expect(result).toBeNull();
    });

    it('should throw error if no fields provided', async () => {
      // Arrange
      const updateData = {};

      // Act & Assert
      await expect(envelopeService.updateEnvelope(1, updateData)).rejects.toThrow(
        'At least one field (title or description) must be provided'
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error if title is empty', async () => {
      // Arrange
      const updateData = { title: '' };

      // Act & Assert
      await expect(envelopeService.updateEnvelope(1, updateData)).rejects.toThrow('Title cannot be empty');
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteEnvelope', () => {
    it('should delete an envelope', async () => {
      // Arrange
      mockRepository.delete.mockResolvedValue(true);

      // Act
      const result = await envelopeService.deleteEnvelope(1);

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('should return false if envelope not found', async () => {
      // Arrange
      mockRepository.delete.mockResolvedValue(false);

      // Act
      const result = await envelopeService.deleteEnvelope(999);

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith(999);
      expect(result).toBe(false);
    });
  });
});
