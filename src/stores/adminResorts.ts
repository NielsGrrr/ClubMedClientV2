import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

// 1. La "carte d'identité" (Interface) pour rassurer TypeScript
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
  indisponibilites?: string[]; // Dates de fermeture (YYYY-MM-DD)
  [key: string]: any; // Autorise d'autres propriétés au cas où
}

const apiClient = axios.create({
  baseURL: 'https://localhost:7110', // Vérifie toujours ton port .NET
  headers: {
    'Content-Type': 'application/json'
  }
})

export const useAdminResortStore = defineStore('adminResorts', () => {
  // 2. On précise à TypeScript que ce tableau contiendra des "Resort"
  const resorts = ref<Resort[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const getAuthHeaders = () => {
    return { Authorization: `Bearer TOKEN_PLACEHOLDER` }
  }

  const fetchResorts = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/api/clubs', { headers: getAuthHeaders() })
      resorts.value = response.data
    } catch (err: any) { // 3. On type l'erreur en "any" pour éviter l'erreur "unknown"
      console.error(err)
      error.value = err.response?.data?.message || err.message || "Erreur lors de la récupération"
    } finally {
      isLoading.value = false
    }
  }

  const createResort = async (resortData: Partial<Resort>) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/api/clubs', resortData, { headers: getAuthHeaders() })
      resorts.value.push(response.data)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || "Erreur lors de la création du séjour"
      return false
    } finally {
      isLoading.value = false
    }
  }

  const getResortById = async (id: number) => {
    // Cherche d'abord dans le store local
    let resort = resorts.value.find(r => r.idClub === id)
    if (!resort) {
      // Si non trouvé, on appelle l'API
      isLoading.value = true
      error.value = null
      try {
        const response = await apiClient.get(`/api/clubs/${id}`, { headers: getAuthHeaders() })
        resort = response.data
        if (resort) {
          resorts.value.push(resort) // On met en cache
        }
      } catch (err: any) {
        error.value = err.response?.data?.message || err.message || "Erreur lors de la récupération du séjour"
      } finally {
        isLoading.value = false
      }
    }
    return resort
  }

  const updateResort = async (id: number, updateData: Partial<Resort>) => {
    isLoading.value = true
    error.value = null
    try {
      // Utilisation de PUT (ou PATCH selon l'API)
      await apiClient.put(`/api/clubs/${id}`, updateData, { headers: getAuthHeaders() })
      
      // Mise à jour de l'état local
      const index = resorts.value.findIndex(r => r.idClub === id)
      if (index !== -1) {
        resorts.value[index] = { ...resorts.value[index], ...updateData } as Resort
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || "Erreur lors de la mise à jour du séjour"
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 4. On précise que l'ID est un nombre
  const deleteResort = async (idClub: number) => {
    isLoading.value = true
    error.value = null
    try {
      await apiClient.delete(`/api/clubs/${idClub}`, { headers: getAuthHeaders() })
      resorts.value = resorts.value.filter(r => r.idClub !== idClub)
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || "Erreur lors de la suppression"
      throw err 
    } finally {
      isLoading.value = false
    }
  }

  return { resorts, isLoading, error, fetchResorts, getResortById, createResort, updateResort, deleteResort }
})