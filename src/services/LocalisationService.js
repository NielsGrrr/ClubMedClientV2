import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export default {
  getAllLocalisations() {
    return apiClient.get('/Localisations');
  },

  getById(id) {
    return apiClient.get(`/Localisations/${id}`);
  }
};
