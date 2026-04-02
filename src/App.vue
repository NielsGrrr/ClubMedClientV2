<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
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

.sub-brand {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 0.9rem;
  margin-left: 8px;
  color: var(--cm-lavande, #9BAED6);
  text-transform: uppercase;
  letter-spacing: 1px;
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
  font-family: 'Inter', sans-serif;
}

.main-nav a:hover {
  background-color: rgba(155, 174, 214, 0.15); /* --cm-lavande transparent */
  color: var(--cm-jaune, #F2A900);
}

.main-nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--cm-jaune, #F2A900);
}

/* Boutons Header */
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

.nav-panier {
  background-color: var(--cm-vert, #8DB4B0);
  color: white;
}
.nav-panier:hover {
  background-color: #6fa09a;
  transform: translateY(-1px);
}

.nav-fav {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}
.nav-fav:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: white;
}

.nav-auth {
  border-radius: var(--cm-radius-sm, 6px);
}

.auth-login {
  background-color: transparent;
  color: var(--cm-blanc, white);
}
.auth-login:hover {
  color: var(--cm-jaune, #F2A900);
}

.auth-register {
  background-color: var(--cm-jaune, #F2A900);
  color: var(--cm-bleu, #1B2A6B);
}
.auth-register:hover {
  background-color: #D4940A;
  transform: translateY(-1px);
}

.auth-profile {
  background-color: var(--cm-lavande, #9BAED6);
  color: var(--cm-bleu, #1B2A6B);
  font-weight: 700;
}
.auth-profile:hover {
  background-color: #cad8f3;
  transform: translateY(-1px);
}

.page-content {
  background-color: var(--cm-bg, #F5F0EA);
  min-height: calc(100vh - 75px);
  padding: 24px;
}
</style>
