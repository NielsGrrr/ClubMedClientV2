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

  // TYPES DE SÉJOUR DYNAMIQUES
  const defaultStayTypes = ['Ski', 'Soleil', 'Nature'];
  const storedStayTypes = JSON.parse(localStorage.getItem('customStayTypes') || 'null');
  const stayTypes = ref<string[]>(storedStayTypes || defaultStayTypes);

  const addStayType = (type: string) => {
    if (type && !stayTypes.value.includes(type)) {
      stayTypes.value.push(type);
      localStorage.setItem('customStayTypes', JSON.stringify(stayTypes.value));
    }
  };

  const removeStayType = (type: string) => {
    stayTypes.value = stayTypes.value.filter(t => t !== type);
    localStorage.setItem('customStayTypes', JSON.stringify(stayTypes.value));
  };

  const sanitizePayload = (data: any) => {
    const clean = { ...data };
    if (clean.prixBase === '' || isNaN(Number(clean.prixBase))) clean.prixBase = null;
    if (clean.tailleM2 === '' || isNaN(Number(clean.tailleM2))) clean.tailleM2 = null;
    if (clean.capacitePersonnes === '' || isNaN(Number(clean.capacitePersonnes))) clean.capacitePersonnes = null;
    
    if (clean.typeChambres) {
      clean.typeChambres = clean.typeChambres.map((tc: any) => ({
        ...tc,
        surface: tc.surface === '' || isNaN(Number(tc.surface)) ? null : Number(tc.surface),
        capaciteMax: tc.capaciteMax === '' || isNaN(Number(tc.capaciteMax)) ? null : Number(tc.capaciteMax),
        prixNuit: tc.prixNuit === '' || isNaN(Number(tc.prixNuit)) ? null : Number(tc.prixNuit)
      }));
    }
    return clean;
  };

  // CRÉER UN NOUVEAU SÉJOUR
  const createResort = async (resortData: Partial<Resort>) => {
    isLoading.value = true
    error.value = null
    try {
      const cleanData = sanitizePayload(resortData);
      const response = await apiClient.post('/Clubs', cleanData)
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
    isLoading.value = true
    let resort = null;
    try {
      // FORCE THE API REQUEST ALWAYS to ensure TypeChambres and metadata are loaded
      const response = await apiClient.get(`/Clubs/id/${id}`)
      resort = response.data
      
      // Update local cache
      const index = resorts.value.findIndex(r => r.idClub === id)
      if (index !== -1) resorts.value[index] = resort;
      else resorts.value.push(resort);
      
    } catch (err: any) {
      error.value = "Séjour introuvable."
    } finally {
      isLoading.value = false
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
      const mergedData = { ...originalResort, ...updateData } as any;
      delete mergedData.photos;
      
      const cleanData = sanitizePayload(mergedData);

      await apiClient.put(`/Clubs/${id}`, cleanData)

      const index = resorts.value.findIndex(r => r.idClub === id)
      if (index !== -1) {
        resorts.value[index] = { ...resorts.value[index], ...updateData } as Resort
      }
      return true
    } catch (err: any) {
      // Affiche l'erreur complète du serveur dans la console pour debugger
      console.error("Détail Erreur 400:", err.response?.data);
      error.value = err.response?.data?.title || "Erreur de validation des données (400). Vérifiez les champs."
      return false
    } finally {
      isLoading.value = false
    }
  }

  // MASQUER / AFFICHER (Sûr : utilise updateResort pour ne rien écraser)
  const toggleVisibility = async (resort: Resort) => {
    if (!resort.idClub) return
    const newStatut = resort.statutMiseEnLigne === 'EN_LIGNE' ? 'MASQUE' : 'EN_LIGNE'
    try {
      // 1. On s'assure d'avoir l'objet COMPLET (avec suites et metas) en cache
      // car sinon PutClub va supprimer les chambres inexistantes dans le payload (Erreur FK 23503)
      await getResortById(resort.idClub)
      
      // 2. On utilise updateResort qui fait déjà le merge avec les données complètes
      await updateResort(resort.idClub, { statutMiseEnLigne: newStatut })
      
      // 3. Met à jour le state local
      const idx = resorts.value.findIndex(r => r.idClub === resort.idClub)
      if (idx !== -1 && resorts.value[idx]) {
        resorts.value[idx].statutMiseEnLigne = newStatut
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.details || err.response?.data?.message || err.message;
      console.error("Toggle error:", errorMsg, err.response?.data)
      error.value = "Erreur lors du changement de visibilité (FK possible)."
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
    stayTypes, addStayType, removeStayType,
    fetchResorts, getResortById, createResort, updateResort, deleteResort, toggleVisibility
  }
})