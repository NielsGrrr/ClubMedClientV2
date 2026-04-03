<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

// Identifiants admin hardcodés (pas besoin de BDD)
const ADMIN_EMAIL = 'admin@clubmed.fr'
const ADMIN_PASSWORD = 'Admin2024!'

const handleLogin = () => {
  isLoading.value = true
  errorMsg.value = ''

  setTimeout(() => {
    if (email.value === ADMIN_EMAIL && password.value === ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true')
      router.push({ name: 'admin-resorts' })
    } else {
      errorMsg.value = 'Identifiants incorrects. Veuillez réessayer.'
    }
    isLoading.value = false
  }, 500)
}
</script>

<template>
  <div class="admin-login-page">
    <div class="admin-login-card">
      <div class="admin-login-header">
        <div class="admin-icon">🔐</div>
        <h1>Administration</h1>
        <p class="admin-subtitle">Espace réservé au personnel autorisé</p>
      </div>

      <div v-if="errorMsg" class="admin-error">
        ⚠️ {{ errorMsg }}
      </div>

      <form @submit.prevent="handleLogin" class="admin-form">
        <div class="admin-field">
          <label for="email">Adresse e-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@clubmed.fr"
            required
            autocomplete="email"
          />
        </div>

        <div class="admin-field">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="admin-btn" :disabled="isLoading">
          {{ isLoading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <div class="admin-footer">
        <RouterLink to="/" class="admin-back">← Retour au site</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #002f6c 0%, #0a4a8a 50%, #1565c0 100%);
  padding: 20px;
}

.admin-login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.admin-login-header {
  text-align: center;
  margin-bottom: 30px;
}

.admin-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.admin-login-header h1 {
  font-size: 1.8rem;
  color: #002f6c;
  margin: 0;
}

.admin-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-top: 6px;
}

.admin-error {
  background: #fff3e0;
  color: #e65100;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  text-align: center;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.admin-field {
  display: flex;
  flex-direction: column;
}

.admin-field label {
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.admin-field input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.admin-field input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.15);
}

.admin-btn {
  background: linear-gradient(135deg, #002f6c, #1565c0);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  margin-top: 8px;
}

.admin-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.admin-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.admin-footer {
  text-align: center;
  margin-top: 24px;
}

.admin-back {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
}

.admin-back:hover {
  color: #1976d2;
}
</style>
