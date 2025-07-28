// Custom Cypress Commands

// Login command
Cypress.Commands.add('login', (username, password) => {
  cy.log(`Attempting login with username: ${username}, password: ${password}`);
  cy.visit('/');
  cy.get('input[name="username"]').clear().type(username);
  cy.get('input[name="password"]').clear().type(password);
  cy.get('button[type="submit"]').click();
  cy.log('Login form submitted');
});

// Logout command
Cypress.Commands.add('logout', () => {
  cy.get('.logout-btn').click();
});

// Create item command
Cypress.Commands.add('createItem', (name, description = '') => {
  cy.get('input[name="name"]').clear().type(name);
  if (description) {
    cy.get('textarea[name="description"]').clear().type(description);
  }
  cy.get('button[type="submit"]').contains('Create Item').click();
});

// Wait for API response
Cypress.Commands.add('waitForAPI', () => {
  cy.wait(1000);
});

// Clean up items
Cypress.Commands.add('cleanupItems', () => {
  cy.get('body').then(($body) => {
    if ($body.find('.delete-btn').length > 0) {
      cy.get('.delete-btn').each(($btn) => {
        cy.wrap($btn).click();
        cy.wait(500);
      });
    }
  });
});

// API request helper
Cypress.Commands.add('apiRequest', (method, url, body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${url}`,
    body,
    headers,
    failOnStatusCode: false
  });
});
