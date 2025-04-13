<template>
  <div class="assets-page">
    <h1 class="page-title">My Protected Assets</h1>
    <p class="page-description">View and manage your intellectual property assets protected by blockchain technology.</p>
    <div class="coming-soon">
      <img src="/images/assets-icon.svg" alt="Coming Soon" class="coming-soon-icon" />
      <h2 class="coming-soon-text">Coming Soon</h2>
      <p>This feature is currently under development.</p>
      <NuxtLink to="/dashboard" class="back-button">Back to Dashboard</NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Assets page component logic can be added here
</script>

<style scoped>
.assets-page {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  color: #d62828;
  margin-bottom: 1rem;
}

.page-description {
  font-size: 1.2rem;
  color: #3d3d3d;
  margin-bottom: 3rem;
}

.coming-soon {
  background-color: white;
  border-radius: 8px;
  padding: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.coming-soon-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 1.5rem;
}

.coming-soon-text {
  font-size: 1.8rem;
  color: #d62828;
  margin-bottom: 1rem;
}

.back-button {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #f5d6a8;
  color: #d62828;
  border: 2px solid #d62828;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #d62828;
  color: white;
}
</style>
