<template>
  <div class="envelope-detail">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading envelope...</p>
    </div>
    
    <div v-else-if="!envelope" class="error-container">
      <h2>Envelope Not Found</h2>
      <p>The envelope you're looking for doesn't exist or has been deleted.</p>
      <button @click="goToDashboard" class="back-button">Back to Dashboard</button>
    </div>
    
    <div v-else class="envelope-container">
      <div class="envelope-header">
        <div>
          <h1 class="envelope-title">{{ envelope.title }}</h1>
          <p class="envelope-description">{{ envelope.description }}</p>
          <div class="envelope-status">
            <span class="status-badge" :class="getStatusClass(envelope.status)">
              {{ formatStatus(envelope.status) }}
            </span>
          </div>
        </div>
        
        <div class="envelope-actions">
          <button 
            v-if="envelope.status === 'HAS_FILES'" 
            @click="sealEnvelope" 
            class="action-button seal-button"
          >
            Seal Envelope
          </button>
          <button 
            v-if="envelope.status === 'SEALED'" 
            @click="unsealEnvelope" 
            class="action-button unseal-button"
          >
            Unseal Envelope
          </button>
          <button 
            v-if="envelope.status === 'SEALED'" 
            @click="downloadSealedEnvelope" 
            class="action-button download-button"
          >
            Download Sealed Envelope
          </button>
          <button 
            v-if="envelope.status === 'SEALED'" 
            @click="postToBlockchain" 
            class="action-button post-button"
          >
            Post to Blockchain
          </button>
        </div>
      </div>
      
      <div class="file-section">
        <h2 class="section-title">Files</h2>
        
        <div v-if="['NEW', 'HAS_FILES'].includes(envelope.status)" class="file-dropzone" 
          @dragover.prevent="onDragOver" 
          @dragleave.prevent="onDragLeave" 
          @drop.prevent="onDrop"
          :class="{ 'active-dropzone': isDragging }"
        >
          <div class="dropzone-content">
            <img src="/images/upload-icon.svg" alt="Upload" class="upload-icon" />
            <p class="dropzone-text">Drag and drop files here or</p>
            <label for="file-input" class="file-input-label">Browse Files</label>
            <input 
              id="file-input" 
              type="file" 
              multiple 
              @change="onFileSelect" 
              class="file-input"
            />
          </div>
        </div>
        
        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
          </div>
          <p>Uploading files... {{ uploadProgress }}%</p>
        </div>
        
        <div v-if="envelope.files && envelope.files.length > 0" class="file-list">
          <table class="file-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Size</th>
                <th>Type</th>
                <th v-if="['NEW', 'HAS_FILES'].includes(envelope.status)">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="file in envelope.files" :key="file.id" class="file-row">
                <td>{{ file.filename }}</td>
                <td>{{ formatFileSize(file.file_size) }}</td>
                <td>{{ file.file_type }}</td>
                <td v-if="['NEW', 'HAS_FILES'].includes(envelope.status)">
                  <button @click="removeFile(file.id)" class="remove-button">
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-else-if="envelope.status !== 'SEALED' && envelope.status !== 'POSTED'" class="empty-files">
          <p>No files added yet. Add files to your envelope using the dropzone above.</p>
        </div>
      </div>
      
      <div v-if="envelope.status === 'SEALED' || envelope.status === 'POSTED'" class="hash-info">
        <h2 class="section-title">Hash Information</h2>
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">Hash Value:</span>
            <span class="info-value hash-value">{{ envelope.hash_value }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Algorithm:</span>
            <span class="info-value">{{ envelope.algorithm }}</span>
          </div>
          <div v-if="envelope.status === 'POSTED'" class="info-row">
            <span class="info-label">Blockchain Transaction:</span>
            <span class="info-value tx-value">{{ envelope.blockchain_tx }}</span>
          </div>
        </div>
      </div>
      
      <!-- Sealing Modal -->
      <div v-if="showSealingModal" class="modal-overlay" @click.self="closeSealingModal">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">Seal Envelope</h2>
            <button @click="closeSealingModal" class="close-button">&times;</button>
          </div>
          <div class="modal-body">
            <p>Select a hashing algorithm to seal your envelope:</p>
            <div class="algorithm-options">
              <div 
                v-for="algo in hashingAlgorithms" 
                :key="algo.value"
                class="algorithm-option"
                :class="{ 'selected': selectedAlgorithm === algo.value }"
                @click="selectedAlgorithm = algo.value"
              >
                <div class="option-radio">
                  <div class="radio-inner" v-if="selectedAlgorithm === algo.value"></div>
                </div>
                <div class="option-details">
                  <h3 class="option-name">{{ algo.name }}</h3>
                  <p class="option-description">{{ algo.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeSealingModal" class="cancel-button">Cancel</button>
            <button @click="confirmSeal" class="submit-button" :disabled="!selectedAlgorithm || isSealing">
              {{ isSealing ? 'Sealing...' : 'Seal Envelope' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const envelopeId = computed(() => route.params.id);

const envelope = ref(null);
const loading = ref(true);
const isDragging = ref(false);
const uploadProgress = ref(0);

// Sealing modal
const showSealingModal = ref(false);
const selectedAlgorithm = ref('');
const isSealing = ref(false);

// Hashing algorithms
const hashingAlgorithms = [
  { 
    value: 'SHA256', 
    name: 'SHA-256', 
    description: 'Secure Hash Algorithm 2, 256-bit. Widely used and highly secure.' 
  },
  { 
    value: 'SHA512', 
    name: 'SHA-512', 
    description: 'Secure Hash Algorithm 2, 512-bit. Provides even stronger security than SHA-256.' 
  },
  { 
    value: 'MD5', 
    name: 'MD5', 
    description: 'Message Digest 5. Fast but less secure, suitable for non-critical applications.' 
  }
];

// Fetch envelope data on component mount
onMounted(async () => {
  await fetchEnvelope();
});

// Fetch envelope data from API
const fetchEnvelope = async () => {
  try {
    loading.value = true;
    
    // Check localStorage first for better user experience
    const localEnvelope = getFromLocalStorage(envelopeId.value);
    if (localEnvelope) {
      envelope.value = localEnvelope;
    }
    
    // Fetch from API
    const response = await fetch(`/api/envelopes?id=${envelopeId.value}`);
    const data = await response.json();
    
    if (data.success) {
      envelope.value = data.envelope;
      
      // Update localStorage
      saveToLocalStorage(data.envelope);
    } else {
      console.error('Failed to fetch envelope:', data.message);
      envelope.value = null;
    }
  } catch (error) {
    console.error('Error fetching envelope:', error);
    envelope.value = null;
  } finally {
    loading.value = false;
  }
};

// Format status for display
const formatStatus = (status) => {
  switch (status) {
    case 'NEW':
      return 'New';
    case 'HAS_FILES':
      return 'Ready to Seal';
    case 'SEALED':
      return 'Sealed';
    case 'POSTED':
      return 'Posted to Blockchain';
    default:
      return status;
  }
};

// Get CSS class for status badge
const getStatusClass = (status) => {
  switch (status) {
    case 'NEW':
      return 'status-new';
    case 'HAS_FILES':
      return 'status-ready';
    case 'SEALED':
      return 'status-sealed';
    case 'POSTED':
      return 'status-posted';
    default:
      return '';
  }
};

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Dropzone handlers
const onDragOver = () => {
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = async (event) => {
  isDragging.value = false;
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    await uploadFiles(files);
  }
};

const onFileSelect = async (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    await uploadFiles(files);
  }
};

// Upload files
const uploadFiles = async (files) => {
  try {
    uploadProgress.value = 10;
    
    const formData = new FormData();
    formData.append('envelopeId', envelopeId.value);
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    uploadProgress.value = 30;
    
    const response = await fetch('/api/files/upload', {
      method: 'POST',
      body: formData
    });
    
    uploadProgress.value = 90;
    
    const data = await response.json();
    
    if (data.success) {
      // Refresh envelope data
      await fetchEnvelope();
    } else {
      alert('Failed to upload files: ' + data.message);
    }
    
    uploadProgress.value = 100;
    
    // Reset progress after a delay
    setTimeout(() => {
      uploadProgress.value = 0;
    }, 2000);
  } catch (error) {
    console.error('Error uploading files:', error);
    alert('An error occurred while uploading files');
    uploadProgress.value = 0;
  }
};

// Remove file
const removeFile = async (fileId) => {
  try {
    const response = await fetch('/api/files/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId,
        envelopeId: envelopeId.value
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Refresh envelope data
      await fetchEnvelope();
    } else {
      alert('Failed to remove file: ' + data.message);
    }
  } catch (error) {
    console.error('Error removing file:', error);
    alert('An error occurred while removing the file');
  }
};

// Seal envelope
const sealEnvelope = () => {
  showSealingModal.value = true;
  selectedAlgorithm.value = hashingAlgorithms[0].value;
};

const closeSealingModal = () => {
  showSealingModal.value = false;
};

const confirmSeal = async () => {
  if (!selectedAlgorithm.value) return;
  
  try {
    isSealing.value = true;
    
    const response = await fetch('/api/sealing/seal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        envelopeId: envelopeId.value,
        algorithm: selectedAlgorithm.value
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      closeSealingModal();
      // Refresh envelope data
      await fetchEnvelope();
    } else {
      alert('Failed to seal envelope: ' + data.message);
    }
  } catch (error) {
    console.error('Error sealing envelope:', error);
    alert('An error occurred while sealing the envelope');
  } finally {
    isSealing.value = false;
  }
};

// Unseal envelope
const unsealEnvelope = async () => {
  if (!confirm('Are you sure you want to unseal this envelope? This will remove the hash information.')) {
    return;
  }
  
  try {
    const response = await fetch('/api/sealing/unseal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        envelopeId: envelopeId.value
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Refresh envelope data
      await fetchEnvelope();
    } else {
      alert('Failed to unseal envelope: ' + data.message);
    }
  } catch (error) {
    console.error('Error unsealing envelope:', error);
    alert('An error occurred while unsealing the envelope');
  }
};

// Download sealed envelope
const downloadSealedEnvelope = async () => {
  try {
    const response = await fetch(`/api/sealing/download?envelopeId=${envelopeId.value}`);
    const data = await response.json();
    
    if (data.success) {
      // Create a download link
      const a = document.createElement('a');
      a.href = `/download?path=${encodeURIComponent(data.filePath)}`;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert('Failed to download sealed envelope: ' + data.message);
    }
  } catch (error) {
    console.error('Error downloading sealed envelope:', error);
    alert('An error occurred while downloading the sealed envelope');
  }
};

// Post to blockchain
const postToBlockchain = async () => {
  if (!confirm('Are you sure you want to post this envelope to the blockchain? This action cannot be undone.')) {
    return;
  }
  
  try {
    const response = await fetch('/api/sealing/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        envelopeId: envelopeId.value
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Refresh envelope data
      await fetchEnvelope();
    } else {
      alert('Failed to post to blockchain: ' + data.message);
    }
  } catch (error) {
    console.error('Error posting to blockchain:', error);
    alert('An error occurred while posting to the blockchain');
  }
};

// Navigate back to dashboard
const goToDashboard = () => {
  router.push('/dashboard');
};

// Helper function to get envelope from localStorage
const getFromLocalStorage = (id) => {
  try {
    const envelopesJson = localStorage.getItem('blockchain-ip-envelopes');
    if (!envelopesJson) return null;
    
    const envelopes = JSON.parse(envelopesJson);
    return envelopes[id] || null;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return null;
  }
};

// Helper function to save envelope to localStorage
const saveToLocalStorage = (envelope) => {
  try {
    // Get existing envelopes from localStorage
    const envelopesJson = localStorage.getItem('blockchain-ip-envelopes');
    let envelopes = envelopesJson ? JSON.parse(envelopesJson) : {};
    
    // Add or update envelope
    envelopes[envelope.id] = envelope;
    
    // Save back to localStorage
    localStorage.setItem('blockchain-ip-envelopes', JSON.stringify(envelopes));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};
</script>

<style scoped>
.envelope-detail {
  padding: 1rem 0;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f5d6a8; /* Manila envelope color */
  border-top: 4px solid #d62828; /* Red */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.envelope-container {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.envelope-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.envelope-title {
  color: #d62828; /* Red */
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
}

.envelope-description {
  color: #3d3d3d; /* Dark slate grey */
  margin: 0 0 1rem 0;
}

.envelope-status {
  margin-top: 0.5rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-new {
  background-color: #e0e0e0;
  color: #555;
}

.status-ready {
  background-color: #c8e6c9;
  color: #2e7d32;
}

.status-sealed {
  background-color: #bbdefb;
  color: #1565c0;
}

.status-posted {
  background-color: #d1c4e9;
  color: #4527a0;
}

.envelope-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-button {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.seal-button {
  background-color: #d62828; /* Red */
  color: white;
}

.seal-button:hover {
  background-color: #b51d1d;
}

.unseal-button {
  background-color: #f5f5f5;
  color: #3d3d3d; /* Dark slate grey */
}

.unseal-button:hover {
  background-color: #e0e0e0;
}

.download-button {
  background-color: #f5d6a8; /* Manila envelope color */
  color: #d62828; /* Red */
}

.download-button:hover {
  background-color: #f0c090;
}

.post-button {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.post-button:hover {
  background-color: #c8e6c9;
}

.section-title {
  color: #d62828; /* Red */
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
}

.file-dropzone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  transition: border-color 0.3s, background-color 0.3s;
}

.active-dropzone {
  border-color: #d62828; /* Red */
  background-color: rgba(245, 214, 168, 0.2); /* Light manila */
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
}

.dropzone-text {
  margin: 0 0 1rem 0;
  color: #3d3d3d; /* Dark slate grey */
}

.file-input-label {
  background-color: #f5d6a8; /* Manila envelope color */
  color: #d62828; /* Red */
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.file-input-label:hover {
  background-color: #f0c090;
}

.file-input {
  display: none;
}

.upload-progress {
  margin-bottom: 1.5rem;
}

.progress-bar {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: #d62828; /* Red */
  transition: width 0.3s;
}

.file-table {
  width: 100%;
  border-collapse: collapse;
}

.file-table th {
  background-color: #f5d6a8; /* Manila envelope color */
  color: #3d3d3d; /* Dark slate grey */
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 600;
}

.file-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #3d3d3d; /* Dark slate grey */
}

.file-row:hover {
  background-color: #f9f9f9;
}

.remove-button {
  background-color: #ffebee;
  color: #c62828;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-button:hover {
  background-color: #ffcdd2;
}

.empty-files {
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  color: #666;
}

.hash-info {
  margin-top: 2rem;
}

.info-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
}

.info-row {
  margin-bottom: 1rem;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: #3d3d3d; /* Dark slate grey */
  margin-right: 0.5rem;
}

.info-value {
  color: #666;
}

.hash-value, .tx-value {
  font-family: monospace;
  word-break: break-all;
}

.back-button {
  background-color: #f5d6a8; /* Manila envelope color */
  color: #d62828; /* Red */
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #f0c090;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  background-color: #f5d6a8; /* Manila envelope color */
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.modal-title {
  color: #d62828; /* Red */
  margin: 0;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #3d3d3d; /* Dark slate grey */
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.algorithm-options {
  margin-top: 1rem;
}

.algorithm-option {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s;
}

.algorithm-option:hover {
  border-color: #d62828; /* Red */
  background-color: #fff9f0;
}

.algorithm-option.selected {
  border-color: #d62828; /* Red */
  background-color: #fff9f0;
}

.option-radio {
  width: 20px;
  height: 20px;
  border: 2px solid #d62828; /* Red */
  border-radius: 50%;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.radio-inner {
  width: 10px;
  height: 10px;
  background-color: #d62828; /* Red */
  border-radius: 50%;
}

.option-details {
  flex: 1;
}

.option-name {
  margin: 0 0 0.5rem 0;
  color: #3d3d3d; /* Dark slate grey */
  font-size: 1.1rem;
}

.option-description {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid #e0e0e0;
}

.cancel-button {
  background-color: #f1f1f1;
  color: #3d3d3d; /* Dark slate grey */
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.submit-button {
  background-color: #d62828; /* Red */
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #b51d1d;
}

.submit-button:disabled {
  background-color: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .envelope-header {
    flex-direction: column;
  }
  
  .envelope-actions {
    margin-top: 1.5rem;
    width: 100%;
  }
}
</style>
