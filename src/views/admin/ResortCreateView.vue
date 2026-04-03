<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminResortStore } from '@/stores/adminResorts'
import type { Resort } from '@/stores/adminResorts'
import adminService from '@/services/adminService'

const router = useRouter()
const resortStore = useAdminResortStore()

const formData = reactive<Partial<Resort>>({
  titre: '',
  description: '',
  localisation: '',
  typeSejour: '',
  statutMiseEnLigne: 'EN_CREATION'
})

const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

const handleSubmit = async () => {
  // on crée le séjour et on récupère son ID !
  const newResortId = await resortStore.createResort(formData)
  
  if (newResortId) {
    if (fileInput.value && fileInput.value.files && fileInput.value.files.length > 0) {
      isUploading.value = true
      try {
        const formDataFiles = new FormData()
        for (let i = 0; i < fileInput.value.files.length; i++) {
          const file = fileInput.value.files.item(i)
          if (file) formDataFiles.append('photos', file)
        }
        await adminService.uploadPhotos(newResortId, formDataFiles)
        alert('Séjour créé ET photos uploadées avec succès !')
      } catch (e: any) {
        alert('Création réussie, mais échec du téléversement : ' + e.message)
      } finally {
        isUploading.value = false
      }
    } else {
      alert('Séjour créé avec succès (sans image) !')
    }
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
          <label for="prixBase">Prix de base (€)</label>
          <input id="prixBase" v-model.number="formData.prixBase" type="number" step="0.01" />
        </div>
        <div class="form-group half">
          <label for="localisation">Localisation</label>
          <input id="localisation" v-model="formData.localisation" type="text" placeholder="Ex: Alpes, France" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label for="tailleM2">Taille (m²)</label>
          <input id="tailleM2" v-model.number="formData.tailleM2" type="number" />
        </div>
        <div class="form-group half">
          <label for="capacite">Capacité (personnes)</label>
          <input id="capacite" v-model.number="formData.capacitePersonnes" type="number" />
        </div>
      </div>

      <div class="form-row">
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

      <div class="form-row">
        <div class="form-group half">
          <label for="statut">Statut initial</label>
          <select id="statut" v-model="formData.statutMiseEnLigne">
            <option value="EN_CREATION">Brouillon (En création)</option>
            <option value="EN_LIGNE">Publié (En ligne)</option>
            <option value="ARCHIVE">Archivé</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Télécharger des Images (Optionnel, liées lors de la création)</label>
        <input type="file" multiple accept="image/*" ref="fileInput" />
        <small v-if="isUploading">Téléversement des images en cours...</small>
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
