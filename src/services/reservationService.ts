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

  async getReservationById(id: number) {
    const response = await api.get(`/Reservations/${id}`);
    return response.data;
  },

  async getReservationFull(resaNum: number) {
    const response = await api.get(`/Reservations/${resaNum}`);
    return response.data;
  },

  // SEED FRONT : Gestion des Clients
  async getClient(id: number) {
    try { const response = await api.get(`/Clients/GetById/${id}`); return response.data; }
    catch { return null; }
  },
  async createClient(data: any) {
    const response = await api.post('/Clients', data);
    return response.data;
  },

  // SEED FRONT : Gestion des Transports
  async getTransport(id: number) {
    try { const response = await api.get(`/Transports/GetById/${id}`); return response.data; }
    catch { return null; }
  },
  async createTransport(data: any) {
    const response = await api.post('/Transports', data);
    return response.data;
  },

  // NOUVEAU : Création de sous-réservation
  async createSousReservation(data: any) {
    const response = await api.post('/SousReservations', data);
    return response.data;
  },

  // NOUVEAU : Création de lien activité pour sous-réservation
  async createSousReservationActivite(data: any) {
    const response = await api.post('/SousReservationActivites', data);
    return response.data;
  }
};