<template>
  <div class="authenticated-layout">
    <!-- Sidebar -->
    <Sidebar />
    
    <div class="main-container">
      <!-- Top Toolbar -->
      <TopToolbar @toggle-menu="toggleMenu" />

      <!-- Burger Menu -->
      <BurgerMenu :is-open="menuOpen" @close="closeMenu" />

      <!-- Main Content Area -->
      <div class="content-area">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TopToolbar from '~/components/auth/TopToolbar.vue'
import Sidebar from '~/components/auth/Sidebar.vue'
import BurgerMenu from '~/components/auth/BurgerMenu.vue'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}
</script>

<style scoped>
.authenticated-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: 250px; /* Width of the sidebar */
  transition: margin-left 0.3s ease;
}

.content-area {
  flex: 1;
  padding-top: 70px; /* Space for fixed toolbar */
  width: 100%;
  background-color: #f9f9f9;
}

@media (max-width: 768px) {
  .main-container {
    margin-left: 70px; /* Width of collapsed sidebar on mobile */
  }
}
</style>
