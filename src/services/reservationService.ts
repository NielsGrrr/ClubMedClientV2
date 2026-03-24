import api from './api';

export default {
  // Récupération des données pour le formulaire
  async getClubs() {
    const response = await api.get('/Clubs');
    return response.data;
  },

  async getTransports() {
    const response = await api.get('/Transports');
    return response.data;
  },

  // Création de la réservation (Ajout en base)
  async createReservation(reservationData: any) {
    // Le statut est forcé à EN_ATTENTE pour indiquer qu'il est dans le panier
    reservationData.resaStatut = "EN_ATTENTE";
    const response = await api.post('/Reservations', reservationData);
    return response.data;
  }
};