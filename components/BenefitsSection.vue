<template>
  <div class="benefits-section">
    <div class="container">
      <h2 class="section-title">How It Works</h2>
      <div class="benefits-container">
        <div class="benefit-card">
          <div class="icon-container">
            <img src="/images/envelope.svg" alt="Envelope" class="benefit-icon" />
          </div>
          <h3 class="benefit-title">Envelope</h3>
          <p class="benefit-description">
            Create a collection of files to be protected (like a zip/tar archive). This establishes your proof of creation with a clear record of your intellectual property.
          </p>
        </div>
        
        <div class="benefit-card">
          <div class="icon-container">
            <img src="/images/seal.svg" alt="Seal" class="benefit-icon" />
          </div>
          <h3 class="benefit-title">Seal the Envelope</h3>
          <p class="benefit-description">
            We create a unique hash for your envelope, ensuring its contents cannot be altered. This immutable record provides tamper-proof evidence of your work's original state.
          </p>
        </div>
        
        <div class="benefit-card">
          <div class="icon-container">
            <img src="/images/blockchain.svg" alt="Blockchain" class="benefit-icon" />
          </div>
          <h3 class="benefit-title">Post to the Blockchain</h3>
          <p class="benefit-description">
            Your hash is minted onto the blockchain, creating a permanent timestamp that serves as verifiable evidence in court and during registration processes.
          </p>
        </div>
        
        <div class="benefit-card">
          <div class="icon-container">
            <img src="/images/receipt.svg" alt="Receipt" class="benefit-icon" />
          </div>
          <h3 class="benefit-title">Receipt NFT</h3>
          <p class="benefit-description">
            Receive a digital receipt containing hash, algorithm, description, timestamp, and author details - your proof of ownership that can be used to fight counterfeiting.
          </p>
        </div>
      </div>
      
      <h2 class="section-title advantages-title">Key Advantages of Blockchain IP Protection</h2>
      <div class="advantages-container">
        <div class="advantage-item">
          <h3 class="advantage-title">Transparency & Trust</h3>
          <p class="advantage-description">
            Provides a shared, transparent view of IP records for all stakeholders, building trust and reducing ownership disputes.
          </p>
        </div>
        
        <div class="advantage-item">
          <h3 class="advantage-title">Traceability</h3>
          <p class="advantage-description">
            Monitors your intellectual property throughout its lifecycle, ensuring proper distribution and preventing unauthorized use.
          </p>
        </div>
        
        <div class="advantage-item">
          <h3 class="advantage-title">Anti-Counterfeiting</h3>
          <p class="advantage-description">
            Records detailed product information that helps distinguish genuine creations from counterfeits, protecting your brand integrity.
          </p>
        </div>
        
        <div class="advantage-item">
          <h3 class="advantage-title">Evidence of Use</h3>
          <p class="advantage-description">
            Records when IP rights were first used in the market, providing crucial evidence in legal disputes and non-use cases.
          </p>
        </div>
        
        <div class="advantage-item">
          <h3 class="advantage-title">Smart Licensing</h3>
          <p class="advantage-description">
            Automates licensing agreements and royalty payments, ensuring fair compensation and reducing disputes between parties.
          </p>
        </div>
        
        <div class="advantage-item">
          <h3 class="advantage-title">Decentralized Security</h3>
          <p class="advantage-description">
            Distributed ledger ensures your IP records are safely stored and protected against single points of failure.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic can be added here if needed
</script>

<style scoped>
.benefits-section {
  background-color: #fff;
  padding: 4rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  color: #d62828; /* Red for prominent text */
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
}

.advantages-title {
  margin-top: 5rem;
}

.benefits-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.benefit-card {
  background-color: #f5d6a8; /* Manila envelope color */
  border-radius: 8px;
  padding: 2rem;
  width: calc(50% - 2rem);
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.benefit-icon {
  width: 64px;
  height: 64px;
}

.benefit-title {
  color: #d62828; /* Red */
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.benefit-description {
  color: #3d3d3d; /* Dark slate grey */
  text-align: center;
  line-height: 1.6;
}

.advantages-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.advantage-item {
  background-color: #f5d6a8; /* Manila envelope color */
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.advantage-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.advantage-title {
  color: #d62828; /* Red */
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  text-align: center;
}

.advantage-description {
  color: #3d3d3d; /* Dark slate grey */
  font-size: 0.95rem;
  line-height: 1.5;
  text-align: center;
}

@media (max-width: 992px) {
  .advantages-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .benefit-card {
    width: 100%;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .advantages-container {
    grid-template-columns: 1fr;
  }
}
</style>
