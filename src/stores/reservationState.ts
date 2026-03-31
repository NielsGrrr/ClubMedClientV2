import { reactive } from 'vue';

export interface Voyageur {
  nom: string;
  prenom: string;
  dateNaissance: string;
  type: 'adulte' | 'enfant';
  activitesSelectionnees: number[];
}

export const reservationState = reactive({
  // Mode édition (modification depuis le panier)
  editMode: false,
  editResaNum: null as number | null,

  // Club / Resort
  clubId: 1,
  clubTitre: 'Club Med Les Arcs Panorama',

  // Type de chambre
  typeChambreId: null as number | null,
  typeChambreNom: '',
  typeChambrePrixNuit: 150, // prix par défaut (voir probleme.md)
  typeChambreCapaciteMax: 10,
  nbChambres: 1, // nombre de chambres du même type

  // Dates
  dateDebut: '',
  dateFin: '',

  // Voyageurs
  nbPersonnes: 1,
  voyageurs: [
    { nom: '', prenom: '', dateNaissance: '', type: 'adulte', activitesSelectionnees: [] }
  ] as Voyageur[],

  // Transport commun (Option B)
  transportId: null as number | null,
  transportNom: '',
  transportPrix: 0,

  // Prix calculés
  prixHT: 0,
  prixTTC: 0,
  tva: 0.10,
});

export const getPrixChambreDefaut = (nomType: string): number => {
  const nom = nomType.toLowerCase();
  if (nom.includes('suite')) return 280;
  if (nom.includes('deluxe') || nom.includes('déluxe')) return 200;
  if (nom.includes('supérieure') || nom.includes('superieure')) return 150;
  return 180;
};

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

  // Prix séjour : prix nuit × nb personnes × nb nuits × nb chambres
  let ht = nuits * prixChambre * nb * nbChambres;

  // Prix activités
  for (const v of reservationState.voyageurs) {
    ht += (v.activitesSelectionnees?.length ?? 0) * 15;
  }

  // Prix transport
  ht += reservationState.transportPrix;

  reservationState.prixHT = Math.round(ht * 100) / 100;
  reservationState.tva = 0.10;
  reservationState.prixTTC = Math.round(ht * 1.10 * 100) / 100;
};

export const resetReservationState = () => {
  reservationState.editMode = false;
  reservationState.editResaNum = null;
  reservationState.clubId = 1;
  reservationState.clubTitre = 'Club Med Les Arcs Panorama';
  reservationState.typeChambreId = null;
  reservationState.typeChambreNom = '';
  reservationState.typeChambrePrixNuit = 150;
  reservationState.typeChambreCapaciteMax = 10;
  reservationState.nbChambres = 1;
  reservationState.dateDebut = '';
  reservationState.dateFin = '';
  reservationState.nbPersonnes = 1;
  reservationState.voyageurs = [{ nom: '', prenom: '', dateNaissance: '', type: 'adulte', activitesSelectionnees: [] }];
  reservationState.transportId = null;
  reservationState.transportNom = '';
  reservationState.transportPrix = 0;
  reservationState.prixHT = 0;
  reservationState.prixTTC = 0;
  reservationState.tva = 0.10;
};