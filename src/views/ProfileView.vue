<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="card-header">
        <h2>Mon Profil</h2>
        <p class="subtitle">Gérez vos informations personnelles.</p>
      </div>

      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-row">
          <div class="form-group" v-if="form.role === 'particulier'">
            <label for="genre">Civilité</label>
            <div class="select-wrapper">
              <select id="genre" v-model="form.genre">
                <option value="Homme">Monsieur</option>
                <option value="Femme">Madame</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>
          <div class="form-group" :class="{'full-width': form.role !== 'particulier'}">
            <label for="nom">{{ form.role === 'entreprise' ? "Nom de l'entreprise" : 'Nom' }} <span class="required">*</span></label>
            <input type="text" id="nom" v-model="form.nom" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="prenom">Prénom {{ form.role === 'entreprise' ? 'du contact' : '' }} <span class="required">*</span></label>
            <input type="text" id="prenom" v-model="form.prenom" required />
          </div>
          <div class="form-group">
            <label for="telephone">Téléphone</label>
            <input type="tel" id="telephone" v-model="form.telephone" />
          </div>
        </div>

        <div class="form-group full-width" v-if="form.role === 'particulier'">
          <label for="dateNaissance">Date de naissance</label>
          <input type="date" id="dateNaissance" v-model="form.dateNaissance" />
        </div>

        <div class="form-group full-width">
          <label for="email">Adresse Email</label>
          <input type="email" id="email" v-model="form.email" disabled class="disabled-input" title="L'email ne peut pas être modifié" />
        </div>

        <Transition name="fade">
          <div v-if="message" :class="['alert', isError ? 'error-alert' : 'success-alert']">
            <span>{{ message }}</span>
          </div>
        </Transition>

        <div class="actions">
          <button type="submit" class="submit-btn" :disabled="isSubmitting" :class="{ 'btn-loading': isSubmitting }">
            <span v-if="!isSubmitting">Mettre à jour</span>
            <span v-else class="loader"></span>
          </button>
          
          <button type="button" class="logout-btn" @click="handleLogout">
            Se déconnecter
          </button>
        </div>
      </form>
      
      <hr class="divider" />
      
      <div class="danger-zone">
        <h3>Zone de danger (RGPD)</h3>
        <p>En supprimant votre compte, toutes vos données personnelles seront effacées de nos serveurs. Cette action est irréversible.</p>
        <button type="button" class="delete-btn" @click="deleteAccount" :disabled="isDeleting">
             <span v-if="!isDeleting">Supprimer mon compte</span>
             <span v-else class="loader loader-red"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  numClient: 0,
  role: 'particulier',
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  genre: '',
  dateNaissance: ''
});

const isSubmitting = ref(false);
const isDeleting = ref(false);
const message = ref('');
const isError = ref(false);

onMounted(() => {
  if (!authStore.isAuthenticated || !authStore.user) {
    router.push('/login');
    return;
  }
  
  const user = authStore.user;
  form.value = {
    numClient: user.numClient,
    role: user.role || 'particulier',
    nom: user.nom || '',
    prenom: user.prenom || '',
    email: user.email || '',
    telephone: user.telephone || '',
    genre: user.genre || '',
    dateNaissance: user.dateNaissance ? user.dateNaissance.split('T')[0] : ''
  } as any;
});

const updateProfile = async () => {
  message.value = '';
  isSubmitting.value = true;
  isError.value = false;

  try {
    const payload = {
      ...form.value,
      dateNaissance: form.value.role === 'particulier' && form.value.dateNaissance ? form.value.dateNaissance : null,
      genre: form.value.role === 'particulier' ? form.value.genre : null
    };

    await api.put(`/Clients/${form.value.numClient}`, payload);
    
    authStore.updateUser(payload);
    
    message.value = 'Profil mis à jour avec succès.';
  } catch (error: any) {
    isError.value = true;
    message.value = 'Erreur lors de la mise à jour du profil.';
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  localStorage.removeItem('isAdmin');
  router.push('/login');
};

const deleteAccount = async () => {
  if (!confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.")) {
    return;
  }
  
  isDeleting.value = true;
  
  try {
    await api.delete(`/Clients/${form.value.numClient}`);
    authStore.logout();
    alert("Votre compte a été supprimé.");
    router.push('/');
  } catch (error) {
    alert("Une erreur est survenue lors de la suppression de votre compte.");
    console.error(error);
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: #f8f9fa;
  font-family: 'Inter', sans-serif;
}

.profile-card {
  width: 100%;
  max-width: 600px;
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

.profile-form {
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
  color: #374151;
}

.required {
  color: #ef4444;
}

input, select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #ffffff;
  color: #1f2937;
  font-size: 0.95rem;
  box-sizing: border-box;
}

input:focus, select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.disabled-input {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: '▼';
  font-size: 0.7rem;
  color: #6b7280;
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
.success-alert {
  background-color: #f0fdf4;
  color: #15803d;
  border-left: 4px solid #22c55e;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.submit-btn, .logout-btn, .delete-btn {
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
  flex: 1;
}

.submit-btn {
  background-color: #2563eb;
  color: #ffffff;
}
.submit-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}
.submit-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.logout-btn {
  background-color: #f3f4f6;
  color: #374151;
}
.logout-btn:hover {
  background-color: #e5e7eb;
}

.divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 2rem 0;
}

.danger-zone {
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #fff5f5;
}

.danger-zone h3 {
  color: #b91c1c;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.danger-zone p {
  color: #7f1d1d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.delete-btn {
  background-color: #ef4444;
  color: white;
}
.delete-btn:hover:not(:disabled) {
  background-color: #dc2626;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s ease-in-out infinite;
}
.loader-red {
  border-top-color: rgba(255, 255, 255, 0.8);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .form-row, .actions {
    flex-direction: column;
    gap: 1.25rem;
  }
}
</style>
