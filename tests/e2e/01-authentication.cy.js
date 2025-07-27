describe('Authentication UI Tests', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    cy.visit('/');
    cy.waitForPageLoad();
  });

  describe('Sign In Page', () => {
    it('should display login form correctly', () => {
      cy.get('.login-container').should('be.visible');
      cy.get('.login-title').should('contain', 'Item Manager');
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible').and('contain', 'Sign In');
    });

    it('should login successfully with valid credentials', () => {
      cy.login(testData.validUser.username, testData.validUser.password);
      
      // Verify successful login
      cy.get('.welcome-text').should('contain', 'Welcome, test!');
      cy.get('.dashboard').should('be.visible');
      cy.get('.logout-btn').should('be.visible');
      
      // Verify URL change
      cy.url().should('not.contain', 'login');
    });

    it('should show error for invalid credentials', () => {
      cy.login('wronguser', 'wrongpass');
      
      // Verify error message
      cy.get('.message').should('contain', 'Invalid credentials');
      cy.get('.login-container').should('be.visible');
      cy.url().should('contain', '/');
    });

    it('should validate required fields', () => {
      // Try to submit empty form
      cy.get('button[type="submit"]').click();
      
      // Check for validation errors
      cy.get('.input-error-text').should('exist');
      cy.get('.login-container').should('be.visible');
    });

    it('should handle multiple invalid login attempts', () => {
      testData.invalidUsers.forEach((user, index) => {
        if (user.username && user.password) {
          cy.login(user.username, user.password);
          cy.get('.message').should('be.visible');
          cy.wait(500);
        }
      });
      
      // Verify form is still functional
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
    });
  });

  describe('Logout Functionality', () => {
    beforeEach(() => {
      cy.login(testData.validUser.username, testData.validUser.password);
      cy.get('.welcome-text').should('be.visible');
    });

    it('should logout successfully', () => {
      cy.logout();
      
      // Verify redirect to login page
      cy.get('.login-container').should('be.visible');
      cy.get('.login-title').should('contain', 'Sign In');
      cy.url().should('contain', '/');
    });

    it('should clear session data on logout', () => {
      cy.logout();
      
      // Try to access dashboard directly
      cy.visit('/');
      cy.get('.login-container').should('be.visible');
    });
  });

  describe('Session Persistence', () => {
    it('should maintain session on page refresh', () => {
      cy.login(testData.validUser.username, testData.validUser.password);
      cy.get('.welcome-text').should('be.visible');
      
      // Refresh page
      cy.reload();
      
      // Verify user is still logged in
      cy.get('.welcome-text').should('be.visible');
      cy.get('.dashboard').should('be.visible');
    });

    it('should redirect to login if no valid session', () => {
      // Clear localStorage to simulate expired session
      cy.clearLocalStorage();
      cy.visit('/');
      
      // Should show login form
      cy.get('.login-container').should('be.visible');
    });
  });
});
