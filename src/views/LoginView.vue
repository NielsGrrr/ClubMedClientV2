<template>
  <div class="login-page">
    <div class="login-card">
      <div class="card-header">
        <h2>Connexion</h2>
        <p class="subtitle">Accédez à votre espace membre.</p>
      </div>

      <form @submit.prevent="submitForm" class="login-form">
        <div class="form-group full-width">
          <label for="email">Adresse Email</label>
          <input type="email" id="email" v-model="form.email" placeholder="votre.email@example.com" required />
        </div>

        <div class="form-group full-width">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" v-model="form.password" placeholder="Votre mot de passe" required />
        </div>

        <Transition name="fade">
          <div v-if="errorMessage" class="alert error-alert">
            <span>{{ errorMessage }}</span>
          </div>
        </Transition>

        <button type="submit" class="submit-btn" :disabled="isSubmitting" :class="{ 'btn-loading': isSubmitting }">
          <span v-if="!isSubmitting">Se connecter</span>
          <span v-else class="loader"></span>
        </button>

        <div class="register-link">
          <p>Pas encore de compte ? <router-link to="/register">S'inscrire</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const form = ref({
  email: '',
  password: ''
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();

const submitForm = async () => {
  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    const payload = {
      email: form.value.email,
      password: form.value.password
    };

    // Appel à l'endpoint de connexion (à créer côté back-end)
    const response = await api.post('/Auth/login', payload);
    
    // Le JWT devrait être retourné avec les infos user dans response.data
    if (response.data && response.data.token) {
      authStore.setAuth(response.data.token, response.data.user);
      router.push('/profile');
    } else {
      errorMessage.value = "Réponse inattendue du serveur.";
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Email ou mot de passe incorrect.';
    } else if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Impossible de se connecter au serveur.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: #f8f9fa;
  font-family: 'Inter', sans-serif;
}

.login-card {
  width: 100%;
  max-width: 450px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h2 {
  font-weight: 700;
  font-size: 1.8rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.full-width {
  width: 100%;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #ffffff;
  font-size: 0.95rem;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.error-alert {
  background-color: #fef2f2;
  color: #b91c1c;
  border-left: 4px solid #ef4444;
}

.submit-btn {
  margin-top: 0.5rem;
  padding: 0.85rem 1.5rem;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.submit-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.register-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.register-link a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
