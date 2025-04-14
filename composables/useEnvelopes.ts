import { ref, reactive } from 'vue';
import { useAsyncData } from '#app';

export interface Envelope {
  id?: number;
  title: string;
  description?: string;
  status: 'NEW' | 'HAS_FILES' | 'SEALED' | 'POSTED';
  created_at?: string;
  updated_at?: string;
  hash_value?: string;
  algorithm?: string;
  readme_content?: string;
  blockchain_tx?: string;
}

export function useEnvelopes() {
  const envelopes = ref<Envelope[]>([]);
  const currentEnvelope = ref<Envelope | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all envelopes
  async function fetchEnvelopes() {
    loading.value = true;
    error.value = null;
    
    try {
      const { data } = await useAsyncData('envelopes', () => 
        $fetch('/api/envelopes')
      );
      
      if (data.value && data.value.success) {
        envelopes.value = data.value.data;
      } else {
        error.value = 'Failed to fetch envelopes';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error fetching envelopes:', err);
    } finally {
      loading.value = false;
    }
  }

  // Fetch a single envelope by ID
  async function fetchEnvelope(id: number) {
    loading.value = true;
    error.value = null;
    
    try {
      const { data } = await useAsyncData(`envelope-${id}`, () => 
        $fetch(`/api/envelopes/${id}`)
      );
      
      if (data.value && data.value.success) {
        currentEnvelope.value = data.value.data;
        return data.value.data;
      } else {
        error.value = 'Failed to fetch envelope';
        return null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error(`Error fetching envelope ${id}:`, err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Create a new envelope
  async function createEnvelope(title: string, description?: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const { data } = await useAsyncData('create-envelope', () => 
        $fetch('/api/envelopes', {
          method: 'POST',
          body: { title, description }
        })
      );
      
      if (data.value && data.value.success) {
        // Add the new envelope to the list
        envelopes.value = [data.value.data, ...envelopes.value];
        return data.value.data;
      } else {
        error.value = 'Failed to create envelope';
        return null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error creating envelope:', err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Update an envelope
  async function updateEnvelope(id: number, updates: { title?: string; description?: string }) {
    loading.value = true;
    error.value = null;
    
    try {
      const { data } = await useAsyncData(`update-envelope-${id}`, () => 
        $fetch(`/api/envelopes/${id}`, {
          method: 'PATCH',
          body: updates
        })
      );
      
      if (data.value && data.value.success) {
        // Update the envelope in the list
        const index = envelopes.value.findIndex(e => e.id === id);
        if (index !== -1) {
          envelopes.value[index] = data.value.data;
        }
        
        // Update current envelope if it's the one being edited
        if (currentEnvelope.value && currentEnvelope.value.id === id) {
          currentEnvelope.value = data.value.data;
        }
        
        return data.value.data;
      } else {
        error.value = 'Failed to update envelope';
        return null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error(`Error updating envelope ${id}:`, err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Delete an envelope
  async function deleteEnvelope(id: number) {
    loading.value = true;
    error.value = null;
    
    try {
      const { data } = await useAsyncData(`delete-envelope-${id}`, () => 
        $fetch(`/api/envelopes/${id}`, {
          method: 'DELETE'
        })
      );
      
      if (data.value && data.value.success) {
        // Remove the envelope from the list
        envelopes.value = envelopes.value.filter(e => e.id !== id);
        
        // Clear current envelope if it's the one being deleted
        if (currentEnvelope.value && currentEnvelope.value.id === id) {
          currentEnvelope.value = null;
        }
        
        return true;
      } else {
        error.value = 'Failed to delete envelope';
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error(`Error deleting envelope ${id}:`, err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    envelopes,
    currentEnvelope,
    loading,
    error,
    fetchEnvelopes,
    fetchEnvelope,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope
  };
}
