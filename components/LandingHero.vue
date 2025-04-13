<template>
  <div class="hero-section">
    <div class="container">
      <h1 class="hero-title">Secure Your Intellectual Property with Blockchain</h1>
      <p class="hero-subtitle">Tamper-proof, timestamped protection for your creative works</p>
      <div class="cta-button">
        <button @click="navigateToRegister" class="register-button">Start Protecting Your IP</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const navigateToRegister = () => {
  // Will be implemented to navigate to registration page
  console.log('Navigate to register');
}
</script>

<style scoped>
.hero-section {
  background-color: #f5d6a8; /* Manila envelope color */
  padding: 4rem 2rem;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-title {
  color: #d62828; /* Red for prominent text */
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.hero-subtitle {
  color: #3d3d3d; /* Dark slate grey */
  font-size: 1.25rem;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  margin-top: 2rem;
}

.register-button {
  background-color: #d62828; /* Red */
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.register-button:hover {
  background-color: #b51d1d;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>
