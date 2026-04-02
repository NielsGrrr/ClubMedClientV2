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
  background-color: var(--cm-bg, #F5F0EA);
  font-family: 'Inter', sans-serif;
}

.login-card {
  width: 100%;
  max-width: 450px;
  background-color: var(--cm-card-bg, #ffffff);
  border-radius: var(--cm-radius-md, 12px);
  box-shadow: var(--cm-shadow-md, 0 4px 20px rgba(27,42,107,0.12));
  padding: 2.5rem;
  border: 1px solid var(--cm-border, #DDD5C8);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h2 {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 2rem;
  color: var(--cm-bleu, #1B2A6B);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--cm-text-light, #6B7280);
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
  color: var(--cm-text, #1B2A6B);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--cm-border, #DDD5C8);
  border-radius: var(--cm-radius-sm, 6px);
  background-color: var(--cm-blanc, #FAFAF8);
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: var(--cm-transition, all 0.25s ease);
}

input:focus {
  outline: none;
  border-color: var(--cm-bleu, #1B2A6B);
  box-shadow: 0 0 0 3px rgba(27, 42, 107, 0.15);
  background-color: #fff;
}

.alert {
  padding: 1rem;
  border-radius: var(--cm-radius-sm, 6px);
  font-size: 0.9rem;
  font-weight: 500;
}

.error-alert {
  background-color: #fef2f2;
  color: #b91c1c;
  border-left: 4px solid var(--cm-danger, #C0392B);
}

.submit-btn {
  margin-top: 0.5rem;
  padding: 0.85rem 1.5rem;
  background-color: var(--cm-bleu, #1B2A6B);
  color: #ffffff;
  border: none;
  border-radius: var(--cm-radius-sm, 6px);
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
  transition: var(--cm-transition, all 0.25s ease);
}

.submit-btn:hover:not(:disabled) {
  background-color: #142260;
  box-shadow: 0 6px 20px rgba(27,42,107,0.35);
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.register-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--cm-text-light, #6b7280);
}

.register-link a {
  color: var(--cm-terre, #A0522D);
  text-decoration: none;
  font-weight: 700;
  transition: color 0.2s;
}

.register-link a:hover {
  color: var(--cm-bleu, #1B2A6B);
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
