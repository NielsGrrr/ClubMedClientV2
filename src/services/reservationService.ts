import api from './api';

export default {
  async getClubs() {
    const response = await api.get('/Clubs');
    return response.data;
  },

  async getTypeChambres() {
    const response = await api.get('/TypeChambres');
    return response.data;
  },

  async getTypeChambresByClub(clubId: number) {
    const response = await api.get('/TypeChambres');
    return response.data.filter((tc: any) => tc.idClub === clubId);
  },

  async getTypeActivites() {
    const response = await api.get('/TypeActivites');
    return response.data;
  },

  async getActivitesAdultes() {
    const response = await api.get('/ActiviteAdultes');
    return response.data;
  },

  async getTransports() {
    const response = await api.get('/Transports');
    return response.data;
  },

  async createReservation(reservationData: any) {
    reservationData.resaStatut = 'EN_ATTENTE';
    const response = await api.post('/Reservations', reservationData);
    return response.data;
  },

  async updateReservation(resaNum: number, reservationData: any) {
    const response = await api.put(`/Reservations/${resaNum}`, reservationData);
    return response.data;
  },
};