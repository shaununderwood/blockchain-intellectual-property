<template>
  <div class="landing-page">
    <LandingHero />
    <BenefitsSection />
    <PricingSection />
  </div>
</template>

<script setup>
import LandingHero from '~/components/LandingHero.vue'
import BenefitsSection from '~/components/BenefitsSection.vue'
import PricingSection from '~/components/PricingSection.vue'
</script>

<style>
.landing-page {
  font-family: 'Arial', sans-serif;
}
</style>
