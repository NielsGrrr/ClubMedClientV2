<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminResortStore } from '@/stores/adminResorts'
import type { Resort } from '@/stores/adminResorts'

import adminService from '@/services/adminService'

const route = useRoute()
const router = useRouter()
const resortStore = useAdminResortStore()

const resortId = Number(route.params.id)

const formData = reactive<Partial<Resort>>({
  titre: '',
  description: '',
  localisation: '',
  typeSejour: '',
  prixBase: undefined,
  tailleM2: undefined,
  capacitePersonnes: undefined,
  photos: [],
  indisponibilites: [],
  typeChambres: []
})

const newDateFermeture = ref('')
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  if (resortId) {
    const resort = await resortStore.getResortById(resortId)
    if (resort) {
      // Pré-remplir le formulaire avec les données existantes
      Object.assign(formData, {
        ...resort,
        photos: resort.photos || [],
        indisponibilites: resort.indisponibilites || []
      })
    } else {
      alert("Séjour introuvable.")
      router.push({ name: 'admin-resorts' })
    }
  }
})

// HU 55 : Gérer l'upload réel de photos vers l'API
const handleFilesSelection = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  
  const formDataFiles = new FormData()
  for (let i = 0; i < target.files.length; i++) {
    const file = target.files.item(i)
    if (file) {
      formDataFiles.append('photos', file)
    }
  }

  isUploading.value = true
  try {
    const res = await adminService.uploadPhotos(resortId, formDataFiles)
    alert('Succès : ' + (res.data.message || 'Photos téléversées !'))
    
    // Ajout visuel temporaire (car l'API actuelle ne lie pas l'image dans la DB)
    for (let i = 0; i < target.files.length; i++) {
      const file = target.files.item(i)
      if (file) {
        formData.photos?.push(URL.createObjectURL(file))
      }
    }
  } catch (err: any) {
    alert('Erreur lors de l\'upload : ' + (err.response?.data || err.message))
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const removePhoto = (index: number) => {
  if (formData.photos) {
    formData.photos.splice(index, 1)
  }
}

// HU 54 : Gérer l'ajout/suppression de dates d'indisponibilité
const addIndisponibilite = () => {
  if (newDateFermeture.value && formData.indisponibilites) {
    if (!formData.indisponibilites.includes(newDateFermeture.value)) {
      formData.indisponibilites.push(newDateFermeture.value)
      // On garde une cohérence de tri
      formData.indisponibilites.sort()
    }
    newDateFermeture.value = ''
  }
}

const removeIndisponibilite = (index: number) => {
  if (formData.indisponibilites) {
    formData.indisponibilites.splice(index, 1)
  }
}

const handleSubmit = async () => {
  const success = await resortStore.updateResort(resortId, formData)
  if (success) {
    router.push({ name: 'admin-resorts' })
  }
}
</script>

<template>
  <div class="resort-edit-container">
    <header class="edit-header">
      <h1>Modifier le Séjour #{{ resortId }}</h1>
      <RouterLink :to="{ name: 'admin-resorts' }" class="btn btn-secondary">Retour</RouterLink>
    </header>

    <div v-if="resortStore.isLoading && !formData.titre" class="loading-message">
      Chargement des données du séjour...
    </div>

    <div v-if="resortStore.error" class="error-message">
      {{ resortStore.error }}
    </div>

    <form v-if="formData.titre" @submit.prevent="handleSubmit" class="resort-form">
      <!-- Section Informations Générales -->
      <fieldset>
        <legend>Informations Générales</legend>
        <div class="form-group">
          <label for="titre">Titre du séjour *</label>
          <input id="titre" v-model="formData.titre" type="text" required />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="formData.description" rows="4"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="prixBase">Prix de base (€)</label>
            <input id="prixBase" v-model.number="formData.prixBase" type="number" step="0.01" />
          </div>
          <div class="form-group half">
            <label for="localisation">Localisation</label>
            <input id="localisation" v-model="formData.localisation" type="text" />
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
      </fieldset>

      <fieldset>
        <legend>Hébergements (Suites)</legend>
        <div v-for="(chambre, index) in formData.typeChambres" :key="'tc-'+index" class="dynamic-row">
          <div class="dynamic-inputs">
            <input v-model="chambre.nomType" placeholder="Nom (Ex: Suite Familiale)" required />
            <input v-model.number="chambre.surface" type="number" placeholder="Surface (m²)" />
            <input v-model.number="chambre.capaciteMax" type="number" placeholder="Capacité" required />
          </div>
          <textarea v-model="chambre.textePresentation" placeholder="Description courte (Ex: Parfait pour les familles)" rows="2"></textarea>
          <button type="button" @click="formData.typeChambres?.splice(index, 1)" class="btn-delete">🗑️ Supprimer</button>
        </div>
        <button type="button" @click="formData.typeChambres?.push({ nomType: '', surface: undefined, capaciteMax: 2, textePresentation: '' })" class="btn-add">+ Ajouter un hébergement</button>
      </fieldset>

      <!-- Section Photos (HU 55) -->
      <fieldset>
        <legend>Galerie Photos (HU 55 - Téléversement Serveur)</legend>
        <div class="add-item-group">
          <!-- Vrai explorateur de fichiers ! -->
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            ref="fileInput" 
            @change="handleFilesSelection" 
            :disabled="isUploading"
          />
          <span v-if="isUploading" class="uploading-text">Téléversement en cours...</span>
        </div>
        <ul class="item-list" v-if="formData.photos && formData.photos.length > 0">
          <li v-for="(photo, index) in formData.photos" :key="`p-${index}`">
            <img :src="photo" class="thumbnail" alt="Aperçu" />
            <span class="item-text" v-if="photo.startsWith('blob:')">Nouvelle image (Aperçu)</span>
            <span class="item-text" v-else>{{ photo }}</span>
            <button type="button" @click="removePhoto(index)" class="btn-remove" title="Retirer">X</button>
          </li>
        </ul>
        <p v-else class="empty-text">Aucune photo pour l'instant.</p>
      </fieldset>

      <!-- Section Indisponibilités (HU 54) -->
      <fieldset>
        <legend>Indisponibilités & Fermetures (HU 54)</legend>
        <div class="add-item-group">
          <input v-model="newDateFermeture" type="date" @keyup.enter.prevent="addIndisponibilite" />
          <button type="button" @click="addIndisponibilite" class="btn btn-secondary btn-sm">Ajouter Date</button>
        </div>
        <ul class="item-list" v-if="formData.indisponibilites && formData.indisponibilites.length > 0">
          <li v-for="(date, index) in formData.indisponibilites" :key="`d-${index}`">
            <span class="item-text">
              <strong>Fermeture :</strong> {{ new Date(date).toLocaleDateString() }}
            </span>
            <button type="button" @click="removeIndisponibilite(index)" class="btn-remove" title="Retirer">X</button>
          </li>
        </ul>
        <p v-else class="empty-text">Aucune date de fermeture prévue.</p>
      </fieldset>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="resortStore.isLoading">
          {{ resortStore.isLoading ? 'Mise à jour en cours...' : 'Sauvegarder les modifications' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.resort-edit-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

fieldset {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  background-color: #fafafa;
}

legend {
  font-weight: 600;
  color: #1976d2;
  padding: 0 0.5rem;
  background-color: transparent;
}

.form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; }
.form-row { display: flex; gap: 1.5rem; }
.half { flex: 1; }

label { font-weight: 500; margin-bottom: 0.5rem; color: #444; }
input, textarea, select {
  padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-family: inherit; font-size: 1rem;
}
input:focus, textarea:focus, select:focus {
  outline: none; border-color: #1976d2; box-shadow: 0 0 0 2px rgba(25,118,210,0.2);
}

.add-item-group {
  display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: center;
}
.add-item-group input { flex: 1; }

.thumbnail { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; }
.item-text { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.95rem; color: #333;}
.item-list { list-style: none; padding: 0; margin: 0; }
.item-list li {
  display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: white;
  border: 1px solid #eee; border-radius: 4px; margin-bottom: 0.5rem;
}

.empty-text { font-style: italic; color: #888; font-size: 0.9rem; margin: 0; }
.btn-remove {
  background: #ffebee; color: #d32f2f; border: none; border-radius: 4px;
  width: 30px; height: 30px; cursor: pointer; font-weight: bold; 
}
.btn-remove:hover { background: #ffcdd2; }

.form-actions { margin-top: 2rem; display: flex; justify-content: flex-end; }
.btn {
  padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer;
  font-weight: 500; text-decoration: none; display: inline-block; font-size: 1rem; transition: opacity 0.2s;
}
.btn-sm { padding: 0.5rem 1rem; font-size: 0.9rem; }
.btn:hover:not(:disabled) { opacity: 0.9; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-primary { background-color: #1976d2; color: white; }
.btn-secondary { background-color: #9e9e9e; color: white; }
.btn-danger { background-color: #d32f2f; color: white; }
.error-message { padding: 1rem; background-color: #ffebee; color: #d32f2f; border-radius: 4px; margin-bottom: 1.5rem; }
.loading-message { text-align: center; padding: 2rem; color: #666; font-weight: 500; }
.uploading-text { color: #1976d2; font-weight: bold; font-size: 0.9rem; animation: pulse 1.5s infinite; }
@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

.dynamic-row {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e1e8ed;
}

.dynamic-inputs {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.dynamic-inputs input { margin-bottom: 0; }

.btn-add { background: none; border: 2px dashed #002f6c; color: #002f6c; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; transition: all 0.2s; }
.btn-add:hover { background: #e8eff5; }
.btn-delete { background: #fee2e2; color: #ef4444; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; margin-top: 10px; }

</style>
