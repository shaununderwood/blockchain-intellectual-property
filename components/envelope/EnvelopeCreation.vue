<template>
  <div class="envelope-creation">
    <button @click="openModal" class="create-button">Create New Envelope</button>
    
    <!-- Envelope Creation Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">Create New Envelope</h2>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="envelope-title">Title of Envelope *</label>
            <input 
              id="envelope-title" 
              v-model="envelopeTitle" 
              type="text" 
              placeholder="Enter a title for your envelope"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label for="envelope-description">Description of Content</label>
            <textarea 
              id="envelope-description" 
              v-model="envelopeDescription" 
              placeholder="Describe the content of your envelope"
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="cancel-button">Cancel</button>
          <button @click="createEnvelope" class="submit-button" :disabled="!envelopeTitle">Create Envelope</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showModal = ref(false);
const envelopeTitle = ref('');
const envelopeDescription = ref('');
const isCreating = ref(false);

const openModal = () => {
  showModal.value = true;
  envelopeTitle.value = '';
  envelopeDescription.value = '';
};

const closeModal = () => {
  showModal.value = false;
};

const createEnvelope = async () => {
  if (!envelopeTitle.value) return;
  
  try {
    isCreating.value = true;
    
    const response = await fetch('/api/envelopes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: envelopeTitle.value,
        description: envelopeDescription.value,
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Save to localStorage for better user experience
      saveToLocalStorage(data.envelopeId, {
        id: data.envelopeId,
        title: data.title,
        description: data.description,
        status: data.status,
        files: []
      });
      
      // Close modal and redirect to envelope detail page
      closeModal();
      router.push(`/dashboard/envelope/${data.envelopeId}`);
    } else {
      alert('Failed to create envelope: ' + data.message);
    }
  } catch (error) {
    console.error('Error creating envelope:', error);
    alert('An error occurred while creating the envelope');
  } finally {
    isCreating.value = false;
  }
};

// Helper function to save envelope to localStorage
const saveToLocalStorage = (id, envelope) => {
  try {
    // Get existing envelopes from localStorage
    const envelopesJson = localStorage.getItem('blockchain-ip-envelopes');
    let envelopes = envelopesJson ? JSON.parse(envelopesJson) : {};
    
    // Add or update envelope
    envelopes[id] = envelope;
    
    // Save back to localStorage
    localStorage.setItem('blockchain-ip-envelopes', JSON.stringify(envelopes));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};
</script>

<style scoped>
.envelope-creation {
  margin-bottom: 2rem;
}

.create-button {
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

.create-button:hover {
  background-color: #b51d1d;
}

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

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #3d3d3d; /* Dark slate grey */
  font-weight: 500;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus, .form-textarea:focus {
  border-color: #d62828; /* Red */
  outline: none;
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
</style>
