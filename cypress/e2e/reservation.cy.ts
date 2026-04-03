const RESA_MOCK_CLUB = {
  idClub: 10,
  titre: 'Club Med Opio en Provence',
  description: 'Un village de charme.',
  noteMoyenne: 4.7,
  numPhoto: 1,
  statutMiseEnLigne: 'ACTIF',
  photoClubs: [],
  typeChambres: [],
  avis: []
};

const RESA_MOCK_CLUBS = [RESA_MOCK_CLUB];

const MOCK_TYPE_CHAMBRES = [
  {
    idTypeChambre: 1,
    nomType: 'Suite Deluxe',
    surface: 45,
    capaciteMax: 3,
    textePresentation: 'Vue mer',
    tarifsChambres: [{ prixParNuit: 250 }]
  }
];

describe('Tunnel de Reservation (HU 27, 30, 31)', () => {
  beforeEach(() => {
    // Mock login
    cy.intercept('POST', '**/Auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-cypress',
        user: { numClient: 1, email: 'cypress@test.com', nom: 'Doe', prenom: 'John', role: 'particulier' }
      }
    }).as('loginRequest');

    // Mock clubs list
    cy.intercept('GET', '**/Clubs', {
      statusCode: 200,
      body: RESA_MOCK_CLUBS
    }).as('getClubs');

    // Mock club detail
    cy.intercept('GET', '**/Clubs/id/**', {
      statusCode: 200,
      body: RESA_MOCK_CLUB
    }).as('getClubDetail');

    // Mock types chambres
    cy.intercept('GET', '**/TypeChambres**', {
      statusCode: 200,
      body: MOCK_TYPE_CHAMBRES
    }).as('getTypesChambres');
  });

  it('Doit effectuer le tunnel de la Step 1 a la Step 4', () => {
    // Etape Initiale : Connexion
    cy.visit('/login');
    cy.get('input[type="email"]').type('cypress@test.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('form').submit();
    cy.wait('@loginRequest');

    // Aller sur la liste annonces
    cy.visit('/annonces');
    cy.wait('@getClubs');
    cy.get('.card').first().find('a.btn-primary').click();

    // AnnonceDetail: attendre le detail et cliquer sur Reserver
    cy.wait('@getClubDetail');
    cy.get('.btn-reserve').click();

    // -- STEP 1 : CHAMBRE + DATES + VOYAGEURS --
    cy.url().should('include', '/reservation/step1');
    cy.wait('@getTypesChambres');

    // Selectionner le type de chambre
    cy.get('.cm-card-select').first().click();

    // Remplir les dates
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const in5days = new Date(); in5days.setDate(in5days.getDate() + 6);
    const dateDebut = tomorrow.toISOString().split('T')[0];
    const dateFin = in5days.toISOString().split('T')[0];
    cy.get('input[type="date"]').eq(0).type(dateDebut);
    cy.get('input[type="date"]').eq(1).type(dateFin);

    // Remplir le 1er voyageur (tous les champs sont requis par isFormValid)
    cy.get('.cm-traveler-body').first().within(() => {
      cy.get('input[type="text"]').eq(0).clear().type('John');       // prenom
      cy.get('input[type="text"]').eq(1).clear().type('Doe');        // nom
      cy.get('input[type="date"]').clear().type('1990-06-15');       // dateNaissance
    });

    // Bouton Continuer doit etre actif maintenant
    cy.get('button').contains(/Continuer|Suivant/i).should('not.be.disabled').click();

    // -- STEP 2 : ACTIVITES --
    cy.url().should('include', '/reservation/step2');
    cy.get('button').contains(/Continuer|Suivant/i).click();

    // -- STEP 3 : TRANSPORT --
    cy.url().should('include', '/reservation/step3');
    cy.get('button').contains(/Continuer|Payer|Validation|Récapitulatif/i).click();

    // -- STEP 4 : RECAP --
    cy.url().should('match', /\/reservation\/step4|\/panier/);

    // Verifie qu'on a bien un recap du prix
    cy.get('.cm-price-sidebar').should('exist');
    cy.get('.cm-price-ttc-value').should('contain', '€');
  });
});

