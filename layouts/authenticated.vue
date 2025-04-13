<template>
  <div class="authenticated-layout">
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
  min-height: 100vh;
  position: relative;
}

.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-area {
  flex: 1;
  padding-top: 70px; /* Space for fixed toolbar */
  padding-left: 2rem;
  padding-right: 2rem;
  width: 100%;
  background-color: #f9f9f9;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
