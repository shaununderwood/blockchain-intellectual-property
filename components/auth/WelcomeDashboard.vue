<template>
  <div class="welcome-dashboard">
    <div class="welcome-container">
      <div class="welcome-header">
        <img src="/images/envelope-large.svg" alt="Blockchain IP Envelope" class="welcome-icon" />
        <h1 class="welcome-title">Welcome to Your Secure IP Dashboard</h1>
      </div>
      
      <div class="dashboard-content">
        <p class="dashboard-message">
          You are now logged into your Blockchain IP account. From here, you can protect your intellectual property using our secure blockchain technology.
        </p>
        
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-value">0</div>
            <div class="stat-label">Protected Assets</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">3</div>
            <div class="stat-label">Days in Trial</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">∞</div>
            <div class="stat-label">Available Seals</div>
          </div>
        </div>
        
        <div class="dashboard-actions">
          <button class="action-button">Protect New IP</button>
          <button class="action-button secondary">View My Protected Assets</button>
        </div>
        
        <div class="quick-guide">
          <h2 class="guide-title">Quick Guide</h2>
          <div class="guide-steps">
            <div class="guide-step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3 class="step-title">Create Envelope</h3>
                <p class="step-description">Collect your files into a single package</p>
              </div>
            </div>
            <div class="guide-step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3 class="step-title">Seal Envelope</h3>
                <p class="step-description">Generate a unique hash for your content</p>
              </div>
            </div>
            <div class="guide-step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3 class="step-title">Post to Blockchain</h3>
                <p class="step-description">Secure your IP with immutable timestamp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Dashboard component logic can be added here
</script>

<style scoped>
.welcome-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: calc(100vh - 70px);
  padding: 2rem;
  background-color: #f9f9f9;
}

.welcome-container {
  max-width: 1000px;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.welcome-header {
  background-color: #f5d6a8; /* Manila envelope color */
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.welcome-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
}

.welcome-title {
  font-size: 2.5rem;
  color: #d62828; /* Red for prominent text */
  margin: 0;
}

.dashboard-content {
  padding: 2rem;
}

.dashboard-message {
  font-size: 1.2rem;
  color: #3d3d3d; /* Dark slate grey */
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.6;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
}

.stat-card {
  flex: 1;
  background-color: #f5d6a8; /* Manila envelope color */
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #d62828; /* Red */
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #3d3d3d; /* Dark slate grey */
  font-weight: 500;
}

.dashboard-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.action-button {
  background-color: #d62828; /* Red */
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #b51d1d;
}

.action-button.secondary {
  background-color: white;
  color: #d62828; /* Red */
  border: 2px solid #d62828;
}

.action-button.secondary:hover {
  background-color: #f5d6a8; /* Manila envelope color */
}

.quick-guide {
  border-top: 1px solid #e0e0e0;
  padding-top: 2rem;
}

.guide-title {
  font-size: 1.5rem;
  color: #d62828; /* Red */
  margin-bottom: 1.5rem;
  text-align: center;
}

.guide-steps {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
}

.guide-step {
  flex: 1;
  display: flex;
  align-items: flex-start;
}

.step-number {
  background-color: #d62828; /* Red */
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.1rem;
  color: #3d3d3d; /* Dark slate grey */
  margin: 0 0 0.5rem 0;
}

.step-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .welcome-dashboard {
    padding: 1rem;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .stats-container {
    flex-direction: column;
  }
  
  .dashboard-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
  
  .guide-steps {
    flex-direction: column;
  }
  
  .guide-step {
    margin-bottom: 1.5rem;
  }
}
</style>
