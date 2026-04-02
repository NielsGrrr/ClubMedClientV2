import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

// 1. Interface pour typer tes données (TypeScript)
export interface Resort {
  idClub?: number;
  titre: string;
  description?: string;
  statutMiseEnLigne?: string;
  noteMoyenne?: number;
  localisation?: string;
  typeSejour?: string;
  prixBase?: number;
  photos?: string[];
  indisponibilites?: string[]; 
  [key: string]: any;
}

// 2. Configuration d'Axios inspirée de AnnonceService.js
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Utilise Azure ou Local selon l'environnement
  headers: {
    'Content-Type': 'application/json'
  }
})

// INTERCEPTEUR : Ajoute automatiquement le TOKEN JWT à chaque requête vers Azure
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const useAdminResortStore = defineStore('adminResorts', () => {
  const resorts = ref<Resort[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // RÉCUPÉRER TOUS LES CLUBS (Dashboard)
  const fetchResorts = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/Clubs') // Aligné sur AnnonceService (/Clubs)
      resorts.value = response.data
    } catch (err: any) {
      console.error("Erreur Fetch:", err)
      error.value = "Impossible de charger les séjours depuis le serveur."
    } finally {
      isLoading.value = false
    }
  }

  // CRÉER UN NOUVEAU SÉJOUR
  const createResort = async (resortData: Partial<Resort>) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/Clubs', resortData)
      resorts.value.push(response.data)
      return response.data.idClub // Retourne l'ID au lieu de 'true' pour permettre l'upload
    } catch (err: any) {
      error.value = "Erreur lors de la création du séjour."
      return null
    } finally {
      isLoading.value = false
    }
  }

  // RÉCUPÉRER UN SEUL SÉJOUR (Pour l'édition)
  const getResortById = async (id: number) => {
    let resort = resorts.value.find(r => r.idClub === id)
    if (!resort) {
      isLoading.value = true
      try {
        const response = await apiClient.get(`/Clubs/id/${id}`)
        resort = response.data
        if (resort) resorts.value.push(resort)
      } catch (err: any) {
        error.value = "Séjour introuvable."
      } finally {
        isLoading.value = false
      }
    }
    return resort
  }

  // METTRE À JOUR (HU 54 / 55)
 const updateResort = async (id: number, updateData: Partial<Resort>) => {
  isLoading.value = true
  error.value = null
  try {
    // NETTOYAGE : On garde TOUTES les propriétés d'origine (comme numPhoto, numPays, etc.) 
    // en fusionnant l'état d'origine du store avec les nouvelles données modifiées.
    const originalResort = resorts.value.find(r => r.idClub === id) || {};
    const cleanData = { ...originalResort, ...updateData } as any;
    delete cleanData.photos;
    delete cleanData.indisponibilites;

    await apiClient.put(`/Clubs/${id}`, cleanData)
    
    const index = resorts.value.findIndex(r => r.idClub === id)
    if (index !== -1) {
      resorts.value[index] = { ...resorts.value[index], ...updateData } as Resort
    }
    return true
  } catch (err: any) {
    // Affiche l'erreur précise du serveur dans la console pour debugger
    console.error("Détail Erreur 400:", err.response?.data?.errors);
    error.value = "Erreur de validation des données (400). Vérifiez les champs."
    return false
  } finally {
    isLoading.value = false
  }
}

  // SUPPRIMER
  const deleteResort = async (idClub: number) => {
    isLoading.value = true
    try {
      await apiClient.delete(`/Clubs/${idClub}`)
      resorts.value = resorts.value.filter(r => r.idClub !== idClub)
    } catch (err: any) {
      error.value = "Échec de la suppression."
      throw err 
    } finally {
      isLoading.value = false
    }
  }

  return { 
    resorts, isLoading, error, 
    fetchResorts, getResortById, createResort, updateResort, deleteResort 
  }
})