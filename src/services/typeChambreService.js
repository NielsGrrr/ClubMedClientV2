import axios from 'axios';

// Rappel : l'URL de base pointe vers votre API Azure via le .env
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export default {
  // Correspond à [HttpGet] dans votre contrôleur
  getAll() {
    return apiClient.get('/TypeChambres');
  },
  
  // Correspond à [HttpGet("{id}")]
  getById(id) {
    return apiClient.get(`/TypeChambres/${id}`);
  }
};