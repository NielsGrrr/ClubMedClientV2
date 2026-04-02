import api from '@/services/api';

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="main-header">
    <div class="nav-container">
      <RouterLink to="/" class="logo-link">
        <span class="brand">Club Med</span><span class="sub-brand">Client</span>
      </RouterLink>

      <nav class="main-nav">
        <RouterLink to="/">Destinations</RouterLink>
        <RouterLink to="/annonces">Annonces</RouterLink>
        <RouterLink to="/mes-favoris" class="nav-fav">
          <span class="heart">❤️</span> Favoris
        </RouterLink>
      </nav>
    </div>
  </header>

  <main class="page-content">
    <RouterView />
  </main>
</template>

<style scoped>
.main-header {
  background-color: #002f6c; 
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo-link {
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.sub-brand {
  font-weight: 300;
  margin-left: 5px;
  color: #add8e6;
}

.main-nav {
  display: flex;
  gap: 20px;
}

.main-nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background 0.3s;
}

.main-nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.main-nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  border-bottom: 2px solid white;
}

.nav-fav {
  background-color: #e63946;
  border-radius: 20px !important;
}

.nav-fav:hover {
  background-color: #c1121f !important;
}

.page-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
}

</style>
