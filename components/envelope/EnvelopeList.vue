<template>
  <div class="envelope-list">
    <h2 class="section-title">Your Envelopes</h2>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading envelopes...</p>
    </div>
    
    <div v-else-if="envelopes.length === 0" class="empty-state">
      <img src="/images/envelope.svg" alt="No envelopes" class="empty-icon" />
      <h3>No Envelopes Found</h3>
      <p>Create your first envelope to start protecting your intellectual property.</p>
    </div>
    
    <div v-else class="envelope-table-container">
      <table class="envelope-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Files</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="envelope in envelopes" :key="envelope.id" class="envelope-row">
            <td>{{ envelope.id }}</td>
            <td>{{ envelope.title }}</td>
            <td>{{ envelope.fileCount || 0 }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(envelope.status)">
                {{ formatStatus(envelope.status) }}
              </span>
            </td>
            <td class="actions-cell">
              <button @click="openEnvelope(envelope.id)" class="action-button view-button">
                Open
              </button>
              <button @click="deleteEnvelope(envelope.id)" class="action-button delete-button">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const envelopes = ref([]);
const loading = ref(true);

// Fetch envelopes on component mount
onMounted(async () => {
  await fetchEnvelopes();
});

// Fetch envelopes from API
const fetchEnvelopes = async () => {
  try {
    loading.value = true;
    const response = await fetch('/api/envelopes');
    const data = await response.json();
    
    if (data.success) {
      envelopes.value = data.envelopes;
      
      // Update localStorage with latest envelope data
      updateLocalStorage(data.envelopes);
    } else {
      console.error('Failed to fetch envelopes:', data.message);
    }
  } catch (error) {
    console.error('Error fetching envelopes:', error);
  } finally {
    loading.value = false;
  }
};

// Open envelope detail page
const openEnvelope = (id) => {
  router.push(`/dashboard/envelope/${id}`);
};

// Delete envelope
const deleteEnvelope = async (id) => {
  if (!confirm('Are you sure you want to delete this envelope? This action cannot be undone.')) {
    return;
  }
  
  try {
    const response = await fetch('/api/envelopes/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Remove from local list
      envelopes.value = envelopes.value.filter(env => env.id !== id);
      
      // Remove from localStorage
      removeFromLocalStorage(id);
    } else {
      alert('Failed to delete envelope: ' + data.message);
    }
  } catch (error) {
    console.error('Error deleting envelope:', error);
    alert('An error occurred while deleting the envelope');
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

// Helper function to update localStorage with latest envelope data
const updateLocalStorage = (envelopeList) => {
  try {
    // Get existing envelopes from localStorage
    const envelopesJson = localStorage.getItem('blockchain-ip-envelopes');
    let storedEnvelopes = envelopesJson ? JSON.parse(envelopesJson) : {};
    
    // Update with latest data
    envelopeList.forEach(envelope => {
      storedEnvelopes[envelope.id] = {
        ...storedEnvelopes[envelope.id],
        ...envelope
      };
    });
    
    // Save back to localStorage
    localStorage.setItem('blockchain-ip-envelopes', JSON.stringify(storedEnvelopes));
  } catch (error) {
    console.error('Error updating localStorage:', error);
  }
};

// Helper function to remove envelope from localStorage
const removeFromLocalStorage = (id) => {
  try {
    // Get existing envelopes from localStorage
    const envelopesJson = localStorage.getItem('blockchain-ip-envelopes');
    if (!envelopesJson) return;
    
    let storedEnvelopes = JSON.parse(envelopesJson);
    
    // Remove envelope
    delete storedEnvelopes[id];
    
    // Save back to localStorage
    localStorage.setItem('blockchain-ip-envelopes', JSON.stringify(storedEnvelopes));
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};
</script>

<style scoped>
.envelope-list {
  margin-top: 2rem;
}

.section-title {
  color: #d62828; /* Red */
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
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

.empty-state {
  background-color: white;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
}

.envelope-table-container {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.envelope-table {
  width: 100%;
  border-collapse: collapse;
}

.envelope-table th {
  background-color: #f5d6a8; /* Manila envelope color */
  color: #3d3d3d; /* Dark slate grey */
  text-align: left;
  padding: 1rem;
  font-weight: 600;
}

.envelope-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #3d3d3d; /* Dark slate grey */
}

.envelope-row:hover {
  background-color: #f9f9f9;
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

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-button {
  background-color: #f5d6a8; /* Manila envelope color */
  color: #d62828; /* Red */
}

.view-button:hover {
  background-color: #f0c090;
}

.delete-button {
  background-color: #ffebee;
  color: #c62828;
}

.delete-button:hover {
  background-color: #ffcdd2;
}
</style>
