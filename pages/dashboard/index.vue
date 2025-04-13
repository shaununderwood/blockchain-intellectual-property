<template>
  <div class="dashboard-page">
    <div class="dashboard-container">
      <h1 class="page-title">Envelope Management</h1>
      <p class="page-description">Create and manage your intellectual property envelopes.</p>
      
      <!-- Envelope Creation Component -->
      <EnvelopeCreation />
      
      <!-- Envelope List Component -->
      <EnvelopeList />
    </div>
  </div>
</template>

<script setup>
import EnvelopeCreation from '~/components/envelope/EnvelopeCreation.vue';
import EnvelopeList from '~/components/envelope/EnvelopeList.vue';
</script>

<style scoped>
.dashboard-page {
  padding: 1rem;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #d62828; /* Red */
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #3d3d3d; /* Dark slate grey */
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
</style>
