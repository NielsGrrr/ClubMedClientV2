import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  reservationState, 
  resetReservationState, 
  calculerAge, 
  updateVoyageurType, 
  getNbNuits, 
  calculerPrix,
  type Voyageur
} from './reservationState';

describe('Reservation State', () => {
  beforeEach(() => {
    // S'assurer qu'on part d'un etat propre pour chaque test
    resetReservationState();
  });

  afterEach(() => {
    resetReservationState();
  });

  it('calculerAge devrait renvoyer l\'age exact selon la date', () => {
    const aujourdHui = new Date();
    // Personne nee il y a exactement 10 ans
    const dateIlYa10Ans = new Date(aujourdHui.getFullYear() - 10, aujourdHui.getMonth(), aujourdHui.getDate());
    
    expect(calculerAge(dateIlYa10Ans.toISOString())).toBe(10);

    // Personne nee il y a 10 ans, mais son anniversaire est demain (donc elle a 9 ans)
    const dateAnniversaireDemain = new Date(aujourdHui.getFullYear() - 10, aujourdHui.getMonth(), aujourdHui.getDate() + 1);
    expect(calculerAge(dateAnniversaireDemain.toISOString())).toBe(9);
  });

  it('updateVoyageurType devrait basculer un voyageur en adulte si >= 18 ans', () => {
    const auj = new Date();
    const dateMajeur = new Date(auj.getFullYear() - 20, auj.getMonth(), auj.getDate()).toISOString();

    const voyageur: Voyageur = {
      nom: '', prenom: '', type: 'enfant', dateNaissance: dateMajeur, activitesSelectionnees: [], transportId: null, transportNom: '', transportPrix: 0
    };

    updateVoyageurType(voyageur);
    expect(voyageur.type).toBe('adulte');
  });

  it('updateVoyageurType devrait basculer un voyageur en enfant si < 18 ans', () => {
    const auj = new Date();
    const dateMineur = new Date(auj.getFullYear() - 10, auj.getMonth(), auj.getDate()).toISOString();

    const voyageur: Voyageur = {
      nom: '', prenom: '', type: 'adulte', dateNaissance: dateMineur, activitesSelectionnees: [], transportId: null, transportNom: '', transportPrix: 0
    };

    updateVoyageurType(voyageur);
    expect(voyageur.type).toBe('enfant');
  });

  it('getNbNuits devrait retourner 0 si les dates ne sont pas definies', () => {
    // Par defaut dans resetReservationState(), ces champs sont vides
    expect(getNbNuits()).toBe(0);
  });

  it('getNbNuits devrait retourner le bon nombre de nuits', () => {
    reservationState.dateDebut = '2026-05-01';
    reservationState.dateFin = '2026-05-10'; // + 9 nuits
    expect(getNbNuits()).toBe(9);
  });

  it('calculerPrix devrait calculer le prix HT et TTC correctement', () => {
    reservationState.dateDebut = '2026-05-01';
    reservationState.dateFin = '2026-05-11'; // 10 nuits
    reservationState.typeChambrePrixNuit = 200;
    reservationState.nbPersonnes = 2;
    reservationState.nbChambres = 1;
    reservationState.prixActivites = 50; 
    
    // Ajoutons un transport a l'un des voyageurs
    reservationState.voyageurs = [{
      nom: 'Test',
      prenom: 'P1',
      dateNaissance: '',
      type: 'adulte',
      activitesSelectionnees: [],
      transportId: 1,
      transportNom: 'Avion',
      transportPrix: 150
    }];

    // Formule HT: (nuits * prixNuit * nbPersonnes * nbChambres) + prixAct + transportV1
    // (10 * 200 * 2 * 1) + 50 + 150 = 4000 + 50 + 150 = 4200.
    
    calculerPrix();

    expect(reservationState.prixHT).toBe(4200);
    // TTC = 4200 * 1.10 = 4620
    expect(reservationState.prixTTC).toBe(4620);
  });
});
