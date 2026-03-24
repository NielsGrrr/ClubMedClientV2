import api from './api';

export default {
  // Récupérer le panier (Toutes les réservations du client en statut EN_ATTENTE)
  async getCart(clientId: number) {
    const response = await api.get('/Reservations');
    // Dans l'idéal, faire une route dédiée côté C# (ex: /Reservations/Client/{id}/Panier)
    // En attendant, on filtre les résultats ici
    return response.data.filter((r: any) => r.clientNum === clientId && r.resaStatut === "EN_ATTENTE");
  },

  // Supprimer une réservation du panier (Annulation avant paiement)
  async removeFromCart(resaNum: number) {
    const response = await api.delete(`/Reservations/${resaNum}`);
    return response.data;
  },

  // Valider le panier (Passe le statut de EN_ATTENTE à CONFIRMEE)
  async validateCart(clientId: number) {
    const cartItems = await this.getCart(clientId);
    
    // On met à jour chaque ligne du panier via PUT
    const promises = cartItems.map((item: any) => {
      item.resaStatut = "CONFIRMEE";
      return api.put(`/Reservations/${item.resaNum}`, item);
    });
    
    await Promise.all(promises);
    return true;
  }
};