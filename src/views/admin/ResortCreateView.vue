<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminResortStore } from '@/stores/adminResorts'
import type { Resort } from '@/stores/adminResorts'

const router = useRouter()
const resortStore = useAdminResortStore()

const formData = reactive<Partial<Resort>>({
  titre: '',
  description: '',
  localisation: '',
  typeSejour: '',
  prixBase: 0
})

const handleSubmit = async () => {
  const success = await resortStore.createResort(formData)
  if (success) {
    router.push({ name: 'admin-resorts' })
  }
}
</script>

<template>
  <div class="resort-create-container">
    <header class="create-header">
      <h1>Nouveau Séjour / Resort</h1>
      <RouterLink :to="{ name: 'admin-resorts' }" class="btn btn-secondary">Retour</RouterLink>
    </header>

    <div v-if="resortStore.error" class="error-message">
      {{ resortStore.error }}
    </div>

    <form @submit.prevent="handleSubmit" class="resort-form">
      <div class="form-group">
        <label for="titre">Titre du séjour *</label>
        <input id="titre" v-model="formData.titre" type="text" required placeholder="Ex: Les Arcs Panorama" />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" v-model="formData.description" rows="4" placeholder="Description du resort..."></textarea>
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label for="localisation">Localisation</label>
          <input id="localisation" v-model="formData.localisation" type="text" placeholder="Ex: Alpes, France" />
        </div>
        <div class="form-group half">
          <label for="typeSejour">Type de séjour</label>
          <select id="typeSejour" v-model="formData.typeSejour">
            <option value="">Sélectionnez un type</option>
            <option value="Ski">Ski</option>
            <option value="Soleil">Soleil</option>
            <option value="Nature">Nature</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="prixBase">Prix de base (€)</label>
        <input id="prixBase" v-model.number="formData.prixBase" type="number" min="0" step="0.01" required />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="resortStore.isLoading">
          {{ resortStore.isLoading ? 'Enregistrement...' : 'Enregistrer le séjour' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.resort-create-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.create-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-header h1 {
  font-size: 1.8rem;
  color: #333;
}

.error-message {
  padding: 1rem;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.resort-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.half {
  flex: 1;
}

label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #444;
}

input, textarea, select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25,118,210,0.2);
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary { background-color: #1976d2; color: white; }
.btn-secondary { background-color: #9e9e9e; color: white; }
</style>
