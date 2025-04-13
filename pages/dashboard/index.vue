<template>
  <NuxtLayout name="authenticated">
    <div class="dashboard-page">
      <WelcomeDashboard />
    </div>
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import WelcomeDashboard from '~/components/auth/WelcomeDashboard.vue'

const { isAuthenticated } = useAuth()

// Redirect to home if not authenticated
onMounted(() => {
  if (!isAuthenticated()) {
    navigateTo('/')
  }
})
</script>

<style scoped>
.dashboard-page {
  width: 100%;
  min-height: 100vh;
}
</style>
