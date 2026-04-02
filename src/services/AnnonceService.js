import axios from 'axios';

// 1. Création de l'instance avec l'URL Azure définie dans ton .env
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 
    'Content-Type': 'application/json'
  }
});

// 2. L'INTERCEPTEUR : Ajoute automatiquement le token s'il existe
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Récupère ton jeton stocké
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // L'ajoute au "badge" de la requête
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default {
  async getAllClubs() {
    return await apiClient.get('/Clubs');
  },

  async getClubsByLocalisation(idLocalisation) {
    return apiClient.get(`/Clubs/localisation/${idLocalisation}`);
  },

  async getAllAnnonces() {
    return await apiClient.get('/TypeChambres');
  },

  async getById(id) {
    return await apiClient.get(`/TypeChambres/${id}`);
  },

  async getClubsById(id) {
    return await apiClient.get(`/Clubs/id/${id}`);
  },

  // AJOUTE CETTE MÉTHODE pour l'upload de photos (HU 55)
  async uploadPhotos(id, formData) {
    return await apiClient.post(`/Clubs/${id}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Obligatoire pour les images
      }
    });
  }
};