<template>
  <div class="burger-menu-container" :class="{ 'active': isOpen }">
    <div class="burger-menu-overlay" @click="closeMenu"></div>
    <div class="burger-menu">
      <div class="menu-header">
        <div class="menu-title">Menu</div>
        <button class="close-button" @click="closeMenu" aria-label="Close menu">
          <div class="close-icon">×</div>
        </button>
      </div>
      
      <div class="menu-content">
        <nav class="menu-nav">
          <ul class="menu-list">
            <li class="menu-item">
              <NuxtLink to="/dashboard" class="menu-link" @click="closeMenu">Dashboard</NuxtLink>
            </li>
            <li class="menu-item">
              <NuxtLink to="/dashboard/protect" class="menu-link" @click="closeMenu">Protect IP</NuxtLink>
            </li>
            <li class="menu-item">
              <NuxtLink to="/dashboard/assets" class="menu-link" @click="closeMenu">My Assets</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
      
      <div class="menu-footer">
        <button class="sign-out-button" @click="handleSignOut">
          <span class="sign-out-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
          <span class="sign-out-text">Sign Out</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const { logout } = useAuth()

const closeMenu = () => {
  emit('close')
}

const handleSignOut = () => {
  closeMenu()
  logout()
}
</script>

<style scoped>
.burger-menu-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s linear 0.3s, opacity 0.3s;
}

.burger-menu-container.active {
  visibility: visible;
  opacity: 1;
  transition-delay: 0s;
}

.burger-menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
}

.burger-menu {
  position: absolute;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100%;
  background-color: white;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  transition: right 0.3s ease;
}

.burger-menu-container.active .burger-menu {
  right: 0;
}

.menu-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5d6a8; /* Manila envelope color */
}

.menu-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #d62828; /* Red for prominent text */
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.close-icon {
  font-size: 1.8rem;
  line-height: 1;
  color: #3d3d3d; /* Dark slate grey */
}

.menu-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-bottom: 0.5rem;
}

.menu-link {
  display: block;
  padding: 1rem 1.5rem;
  color: #3d3d3d; /* Dark slate grey */
  text-decoration: none;
  font-size: 1.1rem;
  transition: background-color 0.3s, color 0.3s;
}

.menu-link:hover, .menu-link.active {
  background-color: rgba(214, 40, 40, 0.1); /* Light red */
  color: #d62828; /* Red */
}

.menu-footer {
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.sign-out-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem;
  background-color: #f5d6a8; /* Manila envelope color */
  border: 1px solid #d62828; /* Red */
  border-radius: 4px;
  cursor: pointer;
  color: #d62828; /* Red */
  font-weight: bold;
  font-size: 1.1rem;
  transition: background-color 0.3s;
}

.sign-out-button:hover {
  background-color: #d62828; /* Red */
  color: white;
}

.sign-out-icon {
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
}

@media (max-width: 400px) {
  .burger-menu {
    width: 100%;
    right: -100%;
  }
}
</style>
