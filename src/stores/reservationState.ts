import { reactive } from 'vue';

export const reservationState = reactive({
  clubId: 1, // Resort par défaut pour le moment
  clubTitre: 'Club Med Magna Marbella', 
  transportId: '',
  transportInfo: '',
  transportPrix: 0,
  dateDebut: '',
  dateFin: '',
  nbPersonnes: 1,
  // Tableau dynamique pour le créateur de personnes
  voyageurs: [
    { nom: '', prenom: '', dateNaissance: '' }
  ],
  prixEstime: 0
});

export const resetReservationState = () => {
  reservationState.clubId = 1;
  reservationState.clubTitre = 'Club Med Magna Marbella';
  reservationState.transportId = '';
  reservationState.transportInfo = '';
  reservationState.transportPrix = 0;
  reservationState.dateDebut = '';
  reservationState.dateFin = '';
  reservationState.nbPersonnes = 1;
  reservationState.voyageurs = [{ nom: '', prenom: '', dateNaissance: '' }];
  reservationState.prixEstime = 0;
};