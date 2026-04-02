<template>
  <div class="register-page">
    <div class="register-card">
      <div class="card-header">
        <h2>Créer un compte</h2>
        <p class="subtitle">Rejoignez-nous pour profiter de services exclusifs.</p>
      </div>
      
      <div class="segmented-control">
        <label class="segment" :class="{ active: form.role === 'particulier' }">
          <input type="radio" value="particulier" v-model="form.role" class="sr-only" />
          <span>👤 Particulier</span>
        </label>
        <label class="segment" :class="{ active: form.role === 'entreprise' }">
          <input type="radio" value="entreprise" v-model="form.role" class="sr-only" />
          <span>🏢 Entreprise</span>
        </label>
      </div>

      <form @submit.prevent="submitForm" class="register-form">
        <!-- Entreprise fields -->
        <div class="form-row" v-if="form.role === 'entreprise'">
          <div class="form-group full-width">
            <label for="nom">Nom de l'entreprise <span class="required">*</span></label>
            <input type="text" id="nom" v-model="form.nom" placeholder="Ex: Acme Corp" required />
          </div>
        </div>

        <!-- Particulier fields -->
        <template v-else>
          <div class="form-row">
            <div class="form-group">
              <label for="genre">Civilité</label>
              <div class="select-wrapper">
                <select id="genre" v-model="form.genre">
                  <option value="" disabled selected>Sélectionner...</option>
                  <option value="Homme">Monsieur</option>
                  <option value="Femme">Madame</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="nom">Nom <span class="required">*</span></label>
              <input type="text" id="nom" v-model="form.nom" placeholder="Ex: Dupont" required />
            </div>
          </div>
        </template>

        <div class="form-row">
          <div class="form-group">
            <label for="prenom">Prénom {{ form.role === 'entreprise' ? 'du contact' : '' }} <span class="required">*</span></label>
            <input type="text" id="prenom" v-model="form.prenom" placeholder="Ex: Jean" required />
          </div>
          
          <div class="form-group" v-if="form.role === 'particulier'">
            <label for="dateNaissance">Date de naissance</label>
            <input type="date" id="dateNaissance" v-model="form.dateNaissance" />
          </div>
          <div class="form-group" v-else>
            <label for="telephone">Téléphone</label>
            <input type="tel" id="telephone" v-model="form.telephone" placeholder="Ex: 06 12 34 56 78" />
          </div>
        </div>

        <div class="form-row" v-if="form.role === 'particulier'">
          <div class="form-group full-width">
            <label for="telephone">Téléphone</label>
            <input type="tel" id="telephone" v-model="form.telephone" placeholder="Ex: 06 12 34 56 78" />
          </div>
        </div>

        <div class="form-group full-width">
          <label for="email">Adresse Email <span class="required">*</span></label>
          <input type="email" id="email" v-model="form.email" placeholder="jean.dupont@example.com" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="password">Mot de passe <span class="required">*</span></label>
            <input type="password" id="password" v-model="form.motDePasseCrypter" placeholder="Min. 6 caractères" required minlength="6" />
          </div>
          <div class="form-group">
            <label for="passwordConfirm">Confirmer le mot de passe <span class="required">*</span></label>
            <input type="password" id="passwordConfirm" v-model="form.motDePasseConfirm" placeholder="Répéter le mot de passe" required />
          </div>
        </div>

        <Transition name="fade">
          <div v-if="errorMessage" class="alert error-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>{{ errorMessage }}</span>
          </div>
        </Transition>

        <Transition name="fade">
          <div v-if="successMessage" class="alert success-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>{{ successMessage }}</span>
          </div>
        </Transition>

        <button type="submit" class="submit-btn" :disabled="isSubmitting" :class="{ 'btn-loading': isSubmitting }">
          <span v-if="!isSubmitting">Créer mon compte</span>
          <span v-else class="loader"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '@/services/api';

const form = ref({
  role: 'particulier',
  genre: '',
  nom: '',
  prenom: '',
  dateNaissance: '',
  email: '',
  telephone: '',
  motDePasseCrypter: '',
  motDePasseConfirm: ''
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const submitForm = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  // Validation: Password match
  if (form.value.motDePasseCrypter !== form.value.motDePasseConfirm) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.';
    return;
  }

  isSubmitting.value = true;

  try {
    const payload = {
      genre: form.value.role === 'particulier' ? form.value.genre || null : null,
      nom: form.value.nom,
      prenom: form.value.prenom,
      dateNaissance: form.value.role === 'particulier' && form.value.dateNaissance ? form.value.dateNaissance : null,
      email: form.value.email,
      telephone: form.value.telephone,
      motDePasseCrypter: form.value.motDePasseCrypter,
      role: form.value.role
    };

    const response = await api.post('/Clients', payload);

    successMessage.value = 'Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.';
    
    // Clear form
    form.value = {
      role: 'particulier',
      genre: '',
      nom: '',
      prenom: '',
      dateNaissance: '',
      email: '',
      telephone: '',
      motDePasseCrypter: '',
      motDePasseConfirm: ''
    };
  } catch (error: any) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.title || 'Une erreur est survenue lors de la création du compte.';
    } else {
      errorMessage.value = error.message;
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Base Variables & Layout */
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: var(--cm-bg, #F5F0EA);
  font-family: 'Inter', sans-serif;
}

.register-card {
  width: 100%;
  max-width: 700px;
  background-color: var(--cm-card-bg, #ffffff);
  border-radius: var(--cm-radius-md, 12px);
  box-shadow: var(--cm-shadow-md, 0 4px 20px rgba(27,42,107,0.12));
  padding: 2.5rem;
  transition: transform 0.3s ease;
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

/* Segmented Control for Account Type */
.segmented-control {
  display: flex;
  background-color: var(--cm-blanc, #FAFAF8);
  padding: 4px;
  border-radius: var(--cm-radius-sm, 6px);
  margin-bottom: 2rem;
  border: 1.5px solid var(--cm-border, #DDD5C8);
}

.segment {
  flex: 1;
  text-align: center;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--cm-text-light, #6B7280);
  transition: var(--cm-transition, all 0.25s);
}

.segment.active {
  background-color: var(--cm-bleu, #1B2A6B);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.segment:hover:not(.active) {
  color: var(--cm-text, #1B2A6B);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Form Styles */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
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

.required {
  color: var(--cm-danger, #C0392B);
}

input, select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--cm-border, #DDD5C8);
  border-radius: var(--cm-radius-sm, 6px);
  background-color: var(--cm-blanc, #FAFAF8);
  color: var(--cm-text, #1B2A6B);
  font-size: 0.95rem;
  transition: var(--cm-transition, all 0.25s);
  font-family: inherit;
  box-sizing: border-box;
}

input::placeholder, select:invalid {
  color: var(--cm-text-muted, #9CA3AF);
}

input:focus, select:focus {
  outline: none;
  border-color: var(--cm-bleu, #1B2A6B);
  box-shadow: 0 0 0 3px rgba(27, 42, 107, 0.15);
  background-color: #fff;
}

/* Custom Select Wrapper */
.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: '▼';
  font-size: 0.7rem;
  color: var(--cm-text-light, #6B7280);
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

select {
  appearance: none;
  padding-right: 2.5rem;
}

/* Alerts */
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

.success-alert {
  background-color: #F0FAF9;
  color: var(--cm-bleu, #1B2A6B);
  border-left: 4px solid var(--cm-vert, #8DB4B0);
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Submit Button */
.submit-btn {
  margin-top: 0.5rem;
  padding: 0.85rem 1.5rem;
  background-color: var(--cm-jaune, #F2A900);
  color: var(--cm-bleu, #1B2A6B);
  border: none;
  border-radius: var(--cm-radius-sm, 6px);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--cm-transition, all 0.25s);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #D4940A;
  box-shadow: 0 6px 20px rgba(242,169,0,0.35);
  transform: translateY(-2px);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Loading Spinner */
.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(27, 42, 107, 0.3);
  border-radius: 50%;
  border-top-color: var(--cm-bleu, #1B2A6B);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .register-card {
    padding: 1.5rem;
  }
}
</style>
