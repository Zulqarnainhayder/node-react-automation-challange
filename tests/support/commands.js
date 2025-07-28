// Custom Cypress Commands

// Login command
Cypress.Commands.add('login', (username, password) => {
  cy.log(`Attempting login with username: ${username}, password: ${password}`);
  cy.visit('/login');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.window().then((win) => {
    const apiUrl = win?.__vite__ ? win.__vite__.env?.VITE_API_URL : undefined;
    cy.log(`VITE_API_URL in window: ${apiUrl}`);
  });
  cy.intercept('POST', '**/login').as('loginRequest');
  cy.get('button[type="submit"]').click();
  cy.log('Login form submitted');
  cy.wait('@loginRequest').then((interception) => {
    cy.log(`Login request URL: ${interception.request.url}`);
    cy.log(`Login request body: ${JSON.stringify(interception.request.body)}`);
    cy.log(`Login response status: ${interception.response && interception.response.statusCode}`);
    cy.log(`Login response body: ${JSON.stringify(interception.response && interception.response.body)}`);
  }).catch((error) => {
    cy.log(`Error occurred during login: ${error.message}`);
  });
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
