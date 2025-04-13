<template>
  <div class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <div class="logo-container">
        <img src="/images/blockchain-ip-logo.svg" alt="Blockchain IP Logo" class="logo-image" />
      </div>
      <div class="website-name" v-if="!isCollapsed">Blockchain IP</div>
      <button class="collapse-button" @click="toggleCollapse">
        <div class="collapse-icon">
          <span class="arrow" :class="{ 'right': isCollapsed, 'left': !isCollapsed }"></span>
        </div>
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <NuxtLink to="/dashboard" class="nav-link">
            <div class="nav-icon">
              <img src="/images/dashboard-icon.svg" alt="Dashboard" class="icon-image" />
            </div>
            <span class="nav-text" v-if="!isCollapsed">Dashboard</span>
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/dashboard/protect" class="nav-link">
            <div class="nav-icon">
              <img src="/images/protect-icon.svg" alt="Protect" class="icon-image" />
            </div>
            <span class="nav-text" v-if="!isCollapsed">Protect IP</span>
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/dashboard/assets" class="nav-link">
            <div class="nav-icon">
              <img src="/images/assets-icon.svg" alt="Assets" class="icon-image" />
            </div>
            <span class="nav-text" v-if="!isCollapsed">My Assets</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
    
    <div class="sidebar-footer">
      <button class="sign-out-button" @click="handleSignOut">
        <div class="nav-icon">
          <img src="/images/signout-icon.svg" alt="Sign Out" class="icon-image" />
        </div>
        <span class="nav-text" v-if="!isCollapsed">Sign Out</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { logout } = useAuth()
const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleSignOut = () => {
  logout()
}
</script>

<style scoped>
.sidebar {
  background-color: #f5d6a8; /* Manila envelope color */
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 1rem;
}

.logo-image {
  width: 100%;
  height: auto;
}

.website-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #d62828; /* Red for prominent text */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collapse-button {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background-color: #f5d6a8;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.collapse-icon {
  width: 10px;
  height: 10px;
  position: relative;
}

.arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-style: solid;
}

.arrow.left {
  border-width: 5px 8px 5px 0;
  border-color: transparent #d62828 transparent transparent;
}

.arrow.right {
  border-width: 5px 0 5px 8px;
  border-color: transparent transparent transparent #d62828;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #3d3d3d; /* Dark slate grey */
  text-decoration: none;
  transition: background-color 0.3s;
}

.nav-link:hover, .nav-link.active {
  background-color: rgba(214, 40, 40, 0.1); /* Light red */
  color: #d62828; /* Red */
}

.nav-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.icon-image {
  width: 100%;
  height: auto;
}

.nav-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.sign-out-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #d62828; /* Red */
  font-weight: 500;
  transition: background-color 0.3s;
}

.sign-out-button:hover {
  background-color: rgba(214, 40, 40, 0.1); /* Light red */
}

@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }
  
  .sidebar.expanded {
    width: 250px;
  }
  
  .website-name {
    display: none;
  }
  
  .sidebar.expanded .website-name {
    display: block;
  }
  
  .nav-text {
    display: none;
  }
  
  .sidebar.expanded .nav-text {
    display: block;
  }
}
</style>
