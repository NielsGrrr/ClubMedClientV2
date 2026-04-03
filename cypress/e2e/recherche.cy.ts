const RECH_MOCK_LOCALISATIONS = [
  { numLocalisation: 1, nomLocalisation: 'Méditerranée' },
  { numLocalisation: 2, nomLocalisation: 'Alpes & Ski' }
];

const RECH_MOCK_CLUBS = [
  {
    idClub: 10,
    titre: 'Club Med Opio en Provence',
    description: 'Un village de charme au cœur de la Provence.',
    noteMoyenne: 4.7,
    numPhoto: 1,
    statutMiseEnLigne: 'ACTIF',
    photoClubs: [],
    typeChambres: [],
    avis: []
  }
];

describe('Moteur de Recherche (HU 1 & 6)', () => {
  beforeEach(() => {
    // Mock API localisations
    cy.intercept('GET', '**/', {
      statusCode: 200,
      body: RECH_MOCK_LOCALISATIONS
    }).as('getLocalisations');

    // Mock API clubs liste (GET /Clubs ou /Clubs/localisation/X)
    cy.intercept('GET', '**/Clubs/localisation/**', {
      statusCode: 200,
      body: RECH_MOCK_CLUBS
    }).as('getClubsByLoc');

    cy.intercept('GET', '**/Clubs', {
      statusCode: 200,
      body: RECH_MOCK_CLUBS
    }).as('getClubs');

    // Mock API club detail (doit etre avant le pattern general)
    cy.intercept('GET', '**/Clubs/id/**', {
      statusCode: 200,
      body: RECH_MOCK_CLUBS[0]
    }).as('getClubDetail');
  });

  it('Doit permettre de filtrer depuis la Home vers AnnonceDetail', () => {
    // 1. Visite la page des destinations
    cy.visit('/localisations');

    // 2. Les cartes de localisation doivent s'afficher (timeout 8s pour le backend réel)
    cy.log('Etape 1: Verification des localisations');
    cy.get('.card-loc', { timeout: 8000 }).should('exist').and('have.length.greaterThan', 0);

    // Clic sur le lien de la premiere localisation
    cy.get('.card-loc').first().find('a.btn-loc').click();

    // 3. Verifie la redirection vers /annonces
    cy.log('Etape 2: Verification de la page Annonces');
    cy.url().should('include', '/annonces');

    // Les cards .card doivent apparaitre (timeout 8s)
    cy.get('.card', { timeout: 8000 }).should('exist').and('have.length.greaterThan', 0);

    // 4. Clic sur le premier Club
    cy.log('Etape 3: Clic sur le premier club');
    cy.get('.card').first().find('a.btn-primary').click();

    // 5. Verification de la page AnnonceDetail
    cy.log('Etape 4: Verification du Detail');
    cy.url().should('include', '/annonces/detail/');
    // Le titre h1 et le bouton réserver doivent apparaitre
    cy.get('h1', { timeout: 8000 }).should('exist');
    cy.get('.btn-reserve').should('exist');
  });
});

