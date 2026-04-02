import api from './api';

export default {
  // Récupérer le panier (statut EN_ATTENTE)
  async getCart(clientId: number) {
    const response = await api.get('/Reservations');
    return response.data.filter((r: any) => r.clientNum === clientId && r.resaStatut === 'EN_ATTENTE');
  },

  // Récupérer les réservations confirmées / payées
  async getMesReservations(clientId: number) {
    const response = await api.get('/Reservations');
    return response.data.filter((r: any) => r.clientNum === clientId && r.resaStatut === 'CONFIRMEE');
  },

  // Toutes les réservations d'un client
  async getAllReservations(clientId: number) {
    const response = await api.get('/Reservations');
    return response.data.filter((r: any) => r.clientNum === clientId);
  },

  // Récupérer une réservation par ID
  async getById(resaNum: number) {
    const response = await api.get(`/Reservations/${resaNum}`);
    return response.data;
  },

  // Supprimer une réservation (gère HTTP 204 No Content)
  async removeFromCart(resaNum: number) {
    try {
      const response = await api.delete(`/Reservations/${resaNum}`);
      return response.data ?? true;
    } catch (e: any) {
      // Si 404, la réservation n'existe plus → considéré comme supprimé
      if (e?.response?.status === 404) return true;
      throw e;
    }
  },

  // Mettre à jour le statut d'une réservation (ex: EN_ATTENTE → CONFIRMEE)
  async updateStatut(resaNum: number, newStatut: string) {
    const existing = await this.getById(resaNum);
    const updated = { ...existing, resaStatut: newStatut };
    // S'assurer que resaNum est bien dans le body pour le PUT
    updated.resaNum = resaNum;
    const response = await api.put(`/Reservations/${resaNum}`, updated);
    return response.data ?? true;
  },

  // Mettre à jour une réservation complète (modification)
  async updateReservation(resaNum: number, data: any) {
    const response = await api.put(`/Reservations/${resaNum}`, data);
    return response.data;
  },

  // Récupérer les clubs pour avoir les noms
  async getClubs() {
    const response = await api.get('/Clubs');
    return response.data;
  },

  // Créer une transaction de paiement
  async createTransaction(transactionData: any) {
    const response = await api.post('/Transactions', transactionData);
    return response.data;
  },

  // Valider tout le panier
  async validateCart(clientId: number) {
    const cartItems = await this.getCart(clientId);
    const promises = cartItems.map((item: any) => this.updateStatut(item.resaNum, 'CONFIRMEE'));
    await Promise.all(promises);
    return true;
  },

  // Valider une sélection de réservations et créer les transactions
  async validateSelected(resaNums: number[]) {
    const promises = resaNums.map(async (num) => {
      // 1. On récupère la résa pour avoir le prix
      const resa = await this.getById(num);
      
      // 2. On passe le statut en CONFIRMEE
      await this.updateStatut(num, 'CONFIRMEE');
      
      // 3. On crée la transaction associée en base de données
      await this.createTransaction({
        resaNum: num,
        transactionMontant: resa.resaPrix || 0,
        transactionDate: new Date().toISOString(),
        transactionMoyenPaiement: 'Stripe',
        transactionStatut: 'Réussite'
      });
    });
    
    await Promise.all(promises);
    return true;
  },

  // Création d'une session Stripe via notre nouveau C# Controller
  async createStripeCheckoutSession(totalAmount: number, description: string) {
    const response = await api.post('/Stripe/CreateCheckoutSession', {
      totalAmount,
      description
    });
    return response.data; // renvoie { url: "https://checkout.stripe.com/..." }
  }
};