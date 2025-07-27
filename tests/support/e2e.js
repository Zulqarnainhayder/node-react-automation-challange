// Cypress E2E Support File
import './commands';

// Hide fetch/XHR requests from command log
Cypress.on('window:before:load', (win) => {
  const originalFetch = win.fetch;
  win.fetch = function (...args) {
    return originalFetch.apply(this, args);
  };
});

// Global configuration
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.wait(500);
});

// Custom error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on application errors
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});
