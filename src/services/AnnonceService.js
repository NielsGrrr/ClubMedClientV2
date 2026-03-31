import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
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
  }
};
