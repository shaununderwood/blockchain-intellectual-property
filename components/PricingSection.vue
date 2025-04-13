<template>
  <div class="pricing-section">
    <div class="container">
      <h2 class="section-title">Simple, Transparent Pricing</h2>
      <p class="section-subtitle">Choose the plan that works best for you</p>
      
      <div class="pricing-cards">
        <div class="pricing-card">
          <div class="pricing-header">
            <h3 class="pricing-title">One-off</h3>
            <div class="pricing-price">
              <span class="price">$2</span>
              <span class="period">per document</span>
            </div>
          </div>
          <div class="pricing-features">
            <ul>
              <li>Seal a single document</li>
              <li>Blockchain timestamp</li>
              <li>Digital receipt</li>
              <li>Permanent protection</li>
            </ul>
          </div>
          <div class="pricing-cta">
            <button class="pricing-button">Protect Your IP Now</button>
          </div>
        </div>
        
        <div class="pricing-card">
          <div class="pricing-header">
            <h3 class="pricing-title">Monthly</h3>
            <div class="pricing-price">
              <span class="price">$15</span>
              <span class="period">per month</span>
            </div>
          </div>
          <div class="pricing-features">
            <ul>
              <li>Seal multiple documents</li>
              <li>Blockchain timestamp</li>
              <li>Digital receipt</li>
              <li>Permanent protection</li>
              <li>Monthly billing</li>
            </ul>
          </div>
          <div class="pricing-cta">
            <button class="pricing-button">Subscribe Monthly</button>
          </div>
        </div>
        
        <div class="pricing-card featured">
          <div class="pricing-badge">Best Value</div>
          <div class="pricing-header">
            <h3 class="pricing-title">Yearly</h3>
            <div class="pricing-price">
              <span class="price">$99</span>
              <span class="period">per year</span>
            </div>
          </div>
          <div class="pricing-features">
            <ul>
              <li><strong>Unlimited</strong> document sealing</li>
              <li>Blockchain timestamp</li>
              <li>Digital receipt</li>
              <li>Permanent protection</li>
              <li>Annual billing</li>
              <li><strong>3-day free trial</strong></li>
            </ul>
          </div>
          <div class="pricing-cta">
            <button class="pricing-button primary">Try Free for 3 Days</button>
          </div>
        </div>
      </div>
      
      <div class="pricing-guarantee">
        <div class="guarantee-icon">
          <img src="/images/guarantee.svg" alt="Guarantee" class="guarantee-img" />
        </div>
        <div class="guarantee-text">
          <h3>100% Satisfaction Guarantee</h3>
          <p>We're confident in our blockchain IP protection service. If you're not completely satisfied with your experience during your free trial period, you can cancel anytime with no questions asked.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pricing-section {
  background-color: #f9f9f9;
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
  margin-bottom: 1rem;
}

.section-subtitle {
  color: #3d3d3d; /* Dark slate grey */
  text-align: center;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.pricing-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.pricing-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  border: 1px solid #e0e0e0;
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.pricing-card.featured {
  border: 2px solid #d62828;
  transform: scale(1.05);
}

.pricing-card.featured:hover {
  transform: scale(1.05) translateY(-5px);
}

.pricing-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #d62828;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: bold;
  border-bottom-left-radius: 8px;
}

.pricing-header {
  background-color: #f5d6a8; /* Manila envelope color */
  padding: 2rem;
  text-align: center;
}

.pricing-title {
  color: #3d3d3d; /* Dark slate grey */
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.pricing-price {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.price {
  color: #d62828; /* Red */
  font-size: 2.5rem;
  font-weight: bold;
}

.period {
  color: #3d3d3d; /* Dark slate grey */
  font-size: 0.9rem;
}

.pricing-features {
  padding: 2rem;
}

.pricing-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pricing-features li {
  color: #3d3d3d; /* Dark slate grey */
  padding: 0.5rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.pricing-features li::before {
  content: "✓";
  color: #d62828; /* Red */
  position: absolute;
  left: 0;
}

.pricing-cta {
  padding: 0 2rem 2rem;
  text-align: center;
}

.pricing-button {
  background-color: white;
  color: #d62828; /* Red */
  border: 2px solid #d62828;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
  width: 100%;
}

.pricing-button:hover {
  background-color: #f5d6a8; /* Manila envelope color */
}

.pricing-button.primary {
  background-color: #d62828; /* Red */
  color: white;
}

.pricing-button.primary:hover {
  background-color: #b51d1d;
}

.pricing-guarantee {
  margin-top: 4rem;
  display: flex;
  align-items: center;
  background-color: #f5d6a8;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.guarantee-icon {
  flex: 0 0 80px;
  margin-right: 2rem;
}

.guarantee-img {
  width: 80px;
  height: 80px;
}

.guarantee-text h3 {
  color: #d62828;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.guarantee-text p {
  color: #3d3d3d;
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 1100px) {
  .pricing-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .pricing-card.featured {
    transform: scale(1);
  }
  
  .pricing-card.featured:hover {
    transform: translateY(-5px);
  }
  
  .pricing-guarantee {
    flex-direction: column;
    text-align: center;
  }
  
  .guarantee-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .pricing-guarantee {
    padding: 1.5rem;
  }
}
</style>
