<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const route = useRoute();

// Réactif : vérifie isAdmin à chaque navigation
const isAdmin = ref(localStorage.getItem('isAdmin') === 'true');
watch(() => route.fullPath, () => {
  isAdmin.value = localStorage.getItem('isAdmin') === 'true';
});
</script>

<template>
  <header class="main-header">
    <div class="nav-container">
      <div class="header-left">
        <RouterLink to="/" class="logo-link">
          <span class="brand">Club Med</span>
        </RouterLink>
        <nav class="main-nav">
          <RouterLink to="/">Destinations</RouterLink>
          <RouterLink to="/annonces">Annonces</RouterLink>
        </nav>
      </div>

      <div class="header-right">
        <template v-if="isAdmin">
          <RouterLink to="/admin/resorts" class="nav-btn nav-admin">
            🛠️ Admin
          </RouterLink>
        </template>

        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/panier" class="nav-btn nav-panier">
            🛒 Panier
          </RouterLink>
        </template>
        
        <RouterLink to="/mes-favoris" class="nav-btn nav-fav">
          ❤️ Favoris
        </RouterLink>
        
        <div class="auth-menu">
          <template v-if="authStore.isAuthenticated">
            <RouterLink to="/profile" class="nav-btn nav-auth auth-profile">
              👤 Mon Profil
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink to="/login" class="nav-btn nav-auth auth-login">
              🔑 Connexion
            </RouterLink>
            <RouterLink to="/register" class="nav-btn nav-auth auth-register">
              S'inscrire
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </header>

  <main class="page-content">
    <RouterView />
  </main>
</template>

<style scoped>
/* TES STYLES DE BASE GARDÉS */
.main-header {
  background-color: var(--cm-bleu, #1B2A6B); 
  color: var(--cm-blanc, #FAFAF8);
  padding: 1rem 0;
  box-shadow: 0 4px 20px rgba(27,42,107,0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 2px solid var(--cm-jaune, #F2A900);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* STYLE DU BOUTON DEBUG / ANTIGRAVITY */
.debug-btn {
  background-color: #6a1b9a; /* Violet pour le mode debug */
  color: white;
  border: none;
  cursor: pointer;
}
.debug-btn:hover {
  background-color: #4a148c;
}

.nav-admin {
  background-color: #E63946; 
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
}

.auth-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 12px;
  border-left: 1px solid rgba(255,255,255,0.2);
  padding-left: 24px;
}

.logo-link {
  text-decoration: none;
  font-family: 'Playfair Display', serif;
  color: var(--cm-blanc, #FAFAF8);
  font-size: 1.6rem;
  font-weight: 700;
  display: flex;
  align-items: baseline;
  margin-right: 16px;
}

.main-nav {
  display: flex;
  gap: 16px;
}

.main-nav a {
  color: var(--cm-blanc, #FAFAF8);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 8px 12px;
  border-radius: var(--cm-radius-sm, 6px);
  transition: all 0.25s ease;
}

.nav-btn {
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-panier { background-color: var(--cm-vert, #8DB4B0); color: white; }
.nav-fav { background-color: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255,255,255,0.3); }
.nav-auth { border-radius: var(--cm-radius-sm, 6px); }
.auth-login { color: white; }
.auth-register { background-color: var(--cm-jaune, #F2A900); color: var(--cm-bleu, #1B2A6B); }
.auth-profile { background-color: var(--cm-lavande, #9BAED6); color: var(--cm-bleu, #1B2A6B); font-weight: 700; }

.page-content {
  background-color: var(--cm-bg, #F5F0EA);
  min-height: calc(100vh - 75px);
  padding: 24px;
}
</style>