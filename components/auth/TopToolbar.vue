<template>
  <div class="top-toolbar">
    <div class="toolbar-content">
      <div class="toolbar-left">
        <div class="website-logo">
          <img src="/images/blockchain-ip-logo.svg" alt="Blockchain IP Logo" class="logo-image" />
        </div>
        <div class="website-name">Blockchain IP</div>
      </div>
      <div class="toolbar-center">
        <nav class="main-nav">
          <ul class="nav-list">
            <li class="nav-item"><NuxtLink to="/dashboard" class="nav-link" :class="{ 'active': isCurrentRoute('/dashboard') }">Dashboard</NuxtLink></li>
            <li class="nav-item"><NuxtLink to="/dashboard/protect" class="nav-link" :class="{ 'active': isCurrentRoute('/dashboard/protect') }">Protect IP</NuxtLink></li>
            <li class="nav-item"><NuxtLink to="/dashboard/assets" class="nav-link" :class="{ 'active': isCurrentRoute('/dashboard/assets') }">My Assets</NuxtLink></li>
          </ul>
        </nav>
      </div>
      <div class="toolbar-right">
        <button class="burger-menu-button" @click="toggleMenu" aria-label="Menu">
          <div class="burger-line"></div>
          <div class="burger-line"></div>
          <div class="burger-line"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const emit = defineEmits(['toggle-menu'])

const isCurrentRoute = (path) => {
  return route.path === path || 
    (path === '/dashboard' && route.path === '/dashboard/');
}

const toggleMenu = () => {
  emit('toggle-menu')
}
</script>

<style scoped>
.top-toolbar {
  background-color: #f5d6a8; /* Manila envelope color */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
}

.toolbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.website-logo {
  margin-right: 1rem;
}

.logo-image {
  height: 40px;
  width: auto;
}

.website-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #d62828; /* Red for prominent text */
}

.toolbar-center {
  display: flex;
  justify-content: center;
}

.main-nav {
  display: flex;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0 1rem;
}

.nav-link {
  color: #3d3d3d; /* Dark slate grey */
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  border-bottom: 2px solid transparent;
  transition: border-color 0.3s, color 0.3s;
}

.nav-link:hover {
  color: #d62828; /* Red */
  border-bottom-color: #d62828;
}

.nav-link.active {
  color: #d62828; /* Red */
  border-bottom: 2px solid #d62828;
  font-weight: bold;
}

.burger-menu-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 20px;
  width: 30px;
  padding: 0;
}

.burger-line {
  background-color: #3d3d3d; /* Dark slate grey */
  height: 3px;
  width: 100%;
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* Responsive styles */
@media (max-width: 768px) {
  .toolbar-center {
    display: none; /* Hide navigation on mobile */
  }
  
  .toolbar-content {
    padding: 0 1rem;
  }
  
  .website-name {
    font-size: 1.2rem;
  }
}
</style>
