import { reactive, watch } from 'vue';

export interface Voyageur {
  nom: string;
  prenom: string;
  dateNaissance: string;
  type: 'adulte' | 'enfant';
  activitesSelectionnees: number[];
  // AJOUT : Transport individuel
  transportId: number | null;
  transportNom: string;
  transportPrix: number;
}

const defaultState = {
  // Mode édition (modification depuis le panier)
  editMode: false,
  editResaNum: null as number | null,

  // Club / Resort
  clubId: 1,
  clubTitre: 'Club Med Les Arcs Panorama',

  // Type de chambre
  typeChambreId: null as number | null,
  typeChambreNom: '',
  typeChambrePrixNuit: 150, // prix par défaut
  typeChambreCapaciteMax: 10,
  nbChambres: 1, // nombre de chambres du même type

  // Dates
  dateDebut: '',
  dateFin: '',

  // Voyageurs
  nbPersonnes: 1,
  voyageurs: [
    { nom: '', prenom: '', dateNaissance: '', type: 'adulte', activitesSelectionnees: [], transportId: null, transportNom: '', transportPrix: 0 }
  ] as Voyageur[],

  // Transport global (servira de valeur par défaut)
  transportId: null as number | null,
  transportNom: '',
  transportPrix: 0,

  // Prix calculés
  prixActivites: 0,
  prixHT: 0,
  prixTTC: 0,
  tva: 0.10,
};

const savedState = sessionStorage.getItem('reservationState');
const initialState = savedState ? JSON.parse(savedState) : defaultState;

export const reservationState = reactive(initialState);

watch(() => reservationState, (state) => {
  sessionStorage.setItem('reservationState', JSON.stringify(state));
}, { deep: true });

export const calculerAge = (dateNaissance: string): number => {
  if (!dateNaissance) return 999;
  const naissance = new Date(dateNaissance);
  const aujourd_hui = new Date();
  let age = aujourd_hui.getFullYear() - naissance.getFullYear();
  const m = aujourd_hui.getMonth() - naissance.getMonth();
  if (m < 0 || (m === 0 && aujourd_hui.getDate() < naissance.getDate())) age--;
  return age;
};

export const updateVoyageurType = (voyageur: Voyageur) => {
  if (voyageur.dateNaissance) {
    const age = calculerAge(voyageur.dateNaissance);
    voyageur.type = age < 18 ? 'enfant' : 'adulte';
  }
};

export const getNbNuits = (): number => {
  if (!reservationState.dateDebut || !reservationState.dateFin) return 0;
  const d1 = new Date(reservationState.dateDebut).getTime();
  const d2 = new Date(reservationState.dateFin).getTime();
  return Math.max(1, Math.ceil((d2 - d1) / (1000 * 3600 * 24)));
};

export const calculerPrix = () => {
  const nuits = getNbNuits();
  const prixChambre = reservationState.typeChambrePrixNuit;
  const nb = reservationState.nbPersonnes;
  const nbChambres = reservationState.nbChambres;

  // 1. Prix séjour : prix nuit × nb personnes × nb nuits × nb chambres
  let ht = nuits * prixChambre * nb * nbChambres;

  // 2. Prix activités (somme des prix d'activités déjà calculés/stockés si besoin)
  ht += reservationState.prixActivites;

  // 3. Prix transport INDIVIDUEL (somme de chaque voyageur)
  const totalTransport = reservationState.voyageurs.reduce((sum, v) => sum + (v.transportPrix || 0), 0);
  ht += totalTransport;

  reservationState.prixHT = Math.round(ht * 100) / 100;
  reservationState.prixTTC = Math.round(ht * 1.10 * 100) / 100;
};

export const resetReservationState = () => {
  reservationState.editMode = false;
  reservationState.editResaNum = null;
  // Ne pas réinitialiser le club par défaut ici, car on le définit juste après dans AnnonceDetail.vue
  // ou du moins, le mettre vide
  reservationState.typeChambreId = null;
  reservationState.typeChambreNom = '';
  reservationState.typeChambrePrixNuit = 150;
  reservationState.typeChambreCapaciteMax = 10;
  reservationState.nbChambres = 1;
  reservationState.dateDebut = '';
  reservationState.dateFin = '';
  reservationState.nbPersonnes = 1;
  reservationState.voyageurs = [{ nom: '', prenom: '', dateNaissance: '', type: 'adulte', activitesSelectionnees: [], transportId: null, transportNom: '', transportPrix: 0 }];
  reservationState.transportId = null;
  reservationState.transportNom = '';
  reservationState.transportPrix = 0;
  reservationState.prixActivites = 0;
  reservationState.prixHT = 0;
  reservationState.prixTTC = 0;
  reservationState.tva = 0.10;
};

export const getPrixChambreDefaut = (): number => {
  return reservationState.typeChambrePrixNuit || 150;
};