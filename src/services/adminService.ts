import axios from 'axios';

// On crée l'instance comme dans AnnonceService
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// MAGIE : On ajoute l'intercepteur pour envoyer le TOKEN à Azure
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Récupéré via ton store Auth
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Récupérer tous les clubs (pour le Dashboard)
  async getResorts() {
    return await apiClient.get('/Clubs');
  },

  // Créer un nouveau séjour
  async createResort(data: any) {
    return await apiClient.post('/Clubs', data);
  },

  // Mettre à jour un séjour (HU 54/55)
  async updateResort(id: number, data: any) {
    return await apiClient.put(`/Clubs/${id}`, data);
  },

  // Supprimer un séjour
  async deleteResort(id: number) {
    return await apiClient.delete(`/Clubs/${id}`);
  },

  // Upload de photos (HU 55 spécifique)
  async uploadPhotos(id: number, formData: FormData) {
    return await apiClient.post(`/Clubs/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};