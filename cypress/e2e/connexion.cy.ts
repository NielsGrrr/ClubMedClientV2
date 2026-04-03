describe('La Connexion (HU 40)', () => {

  it('Affiche un message derreur avec de mauvais identifiants', () => {
    cy.intercept('POST', '**/Auth/login', {
      statusCode: 401,
      body: { message: "Identifiants invalides." } // Simulation echec
    }).as('loginFail');

    cy.visit('/login');
    cy.get('input[type="email"]').type('fake@example.com');
    cy.get('input[type="password"]').type('mauvais-password');
    cy.get('form').submit();

    cy.wait('@loginFail');

    // Verification du message d'erreur rouge (selon notre refonte CSS : error-alert)
    cy.get('.error-alert').should('be.visible').and('contain', 'Email ou mot de passe incorrect');
  });

  it('Redirige vers l\'accueil avec nom modifie en haut avec de bons identifiants', () => {
    cy.intercept('POST', '**/Auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-valid-jwt',
        user: { numClient: 1, email: 'john@example.com', nom: 'Doe', prenom: 'John', role: 'particulier' }
      }
    }).as('loginSuccess');

    cy.visit('/login');
    cy.get('input[type="email"]').type('john@example.com');
    cy.get('input[type="password"]').type('GrosSecret!!');
    cy.get('form').submit();

    cy.wait('@loginSuccess');

    // Verification de la redirection vers profil ou accueil selon l'implementation du routeur.
    // L'implémentation standard pousse de '/login' a '/profile' ou '/'.
    // Le test vérifie que le header a change (Affichage bouton de Profil).
    cy.url().should('not.include', '/login');
    
    // Vérifier l'affichage du layout "Mon profil"
    cy.get('.auth-profile').should('be.visible').and('contain', 'Mon Profil');
    
    // Pour s'assurer qu'au moins l'etat est connecte
    cy.window().its('localStorage').invoke('getItem', 'token').should('not.be.null');
  });

});
