describe('CRUD Operations UI Tests', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    // Login before each test
    cy.login(testData.validUser.username, testData.validUser.password);
    cy.get('.welcome-text').should('be.visible');
    cy.waitForAPI();
  });

  afterEach(() => {
    // Cleanup items after each test
    cy.cleanupItems();
  });

  describe('Create Items', () => {
    it('should create item with name and description', () => {
      const item = testData.testItems[0];
      
      cy.createItem(item.name, item.description);
      
      // Verify success message
      cy.get('.message').should('contain', 'Item created successfully');
      
      // Verify item appears in list
      cy.get('.item-card').should('contain', item.name);
      cy.get('.item-card').should('contain', item.description);
      
      // Verify item count
      cy.get('.items-header h2').should('contain', 'Your Items (1)');
    });

    it('should create item with name only', () => {
      const item = testData.testItems[2]; // Item with empty description
      
      cy.createItem(item.name);
      
      // Verify creation
      cy.get('.message').should('contain', 'Item created successfully');
      cy.get('.item-card').should('contain', item.name);
    });

    it('should validate required name field', () => {
      // Try to create item without name
      cy.get('button[type="submit"]').contains('Create Item').click();
      
      // Verify validation error
      cy.get('.input-error-text').should('contain', 'Item Name is required');
      cy.get('.empty-state').should('be.visible');
    });

    it('should handle special characters in item creation', () => {
      const specialItem = testData.testItems[3];
      
      cy.createItem(specialItem.name, specialItem.description);
      
      // Verify special characters are handled correctly
      cy.get('.message').should('contain', 'Item created successfully');
      cy.get('.item-card').should('contain', specialItem.name);
    });
  });

  describe('Read/Display Items', () => {
    it('should display empty state when no items', () => {
      cy.get('.empty-state').should('be.visible');
      cy.get('.empty-state').should('contain', 'No items yet');
      cy.get('.items-header h2').should('contain', 'Your Items (0)');
    });

    it('should display multiple items correctly', () => {
      // Create multiple items
      testData.testItems.slice(0, 3).forEach((item, index) => {
        cy.createItem(item.name, item.description);
        cy.wait(500);
        
        // Verify item count increases
        cy.get('.items-header h2').should('contain', `Your Items (${index + 1})`);
      });
      
      // Verify all items are displayed
      cy.get('.item-card').should('have.length', 3);
      
      // Verify each item content
      testData.testItems.slice(0, 3).forEach((item) => {
        cy.get('.item-card').should('contain', item.name);
      });
    });

    it('should refresh items list', () => {
      // Create an item
      cy.createItem(testData.testItems[0].name, testData.testItems[0].description);
      cy.get('.item-card').should('have.length', 1);
      
      // Click refresh button
      cy.get('.refresh-btn').click();
      cy.waitForAPI();
      
      // Verify item is still there
      cy.get('.item-card').should('have.length', 1);
      cy.get('.item-card').should('contain', testData.testItems[0].name);
    });
  });

  describe('Update Items', () => {
    beforeEach(() => {
      // Create a test item for editing
      cy.createItem(testData.testItems[0].name, testData.testItems[0].description);
      cy.get('.item-card').should('be.visible');
    });

    it('should edit item successfully', () => {
      // Click edit button
      cy.get('.edit-btn').first().click();
      
      // Verify form is populated
      cy.get('input[name="name"]').should('have.value', testData.testItems[0].name);
      cy.get('textarea[name="description"]').should('have.value', testData.testItems[0].description);
      
      // Update item
      cy.get('input[name="name"]').clear().type(testData.editedItem.name);
      cy.get('textarea[name="description"]').clear().type(testData.editedItem.description);
      cy.get('button[type="submit"]').contains('Update Item').click();
      
      // Verify update success
      cy.get('.message').should('contain', 'Item updated successfully');
      cy.get('.item-card').should('contain', testData.editedItem.name);
      cy.get('.item-card').should('contain', testData.editedItem.description);
    });

    it('should cancel edit operation', () => {
      const originalItem = testData.testItems[0];
      
      // Click edit button
      cy.get('.edit-btn').first().click();
      
      // Make changes but cancel
      cy.get('input[name="name"]').clear().type('Cancelled Edit');
      cy.get('.cancel-btn').click();
      
      // Verify original item is unchanged
      cy.get('.item-card').should('contain', originalItem.name);
      cy.get('.item-card').should('not.contain', 'Cancelled Edit');
    });

    it('should validate required fields during edit', () => {
      // Click edit button
      cy.get('.edit-btn').first().click();
      
      // Clear name field and try to submit
      cy.get('input[name="name"]').clear();
      cy.get('button[type="submit"]').contains('Update Item').click();
      
      // Verify validation error
      cy.get('.input-error-text').should('contain', 'Item Name is required');
    });
  });

  describe('Delete Items', () => {
    beforeEach(() => {
      // Create test items for deletion
      testData.testItems.slice(0, 2).forEach((item) => {
        cy.createItem(item.name, item.description);
        cy.wait(500);
      });
      cy.get('.item-card').should('have.length', 2);
    });

    it('should delete single item', () => {
      // Delete first item
      cy.get('.delete-btn').first().click();
      
      // Verify deletion success
      cy.get('.message').should('contain', 'Item deleted successfully');
      cy.get('.items-header h2').should('contain', 'Your Items (1)');
      cy.get('.item-card').should('have.length', 1);
    });

    it('should delete all items', () => {
      // Delete both items
      cy.get('.delete-btn').first().click();
      cy.wait(500);
      cy.get('.delete-btn').first().click();
      cy.wait(500);
      
      // Verify all items deleted
      cy.get('.empty-state').should('be.visible');
      cy.get('.items-header h2').should('contain', 'Your Items (0)');
    });

    it('should update item count after deletion', () => {
      // Verify initial count
      cy.get('.items-header h2').should('contain', 'Your Items (2)');
      
      // Delete one item
      cy.get('.delete-btn').first().click();
      cy.waitForAPI();
      
      // Verify count updated
      cy.get('.items-header h2').should('contain', 'Your Items (1)');
    });
  });

  describe('Form Interactions', () => {
    it('should clear form after successful creation', () => {
      cy.createItem(testData.testItems[0].name, testData.testItems[0].description);
      
      // Verify form is cleared
      cy.get('input[name="name"]').should('have.value', '');
      cy.get('textarea[name="description"]').should('have.value', '');
    });

    it('should handle form submission states', () => {
      // Start creating item
      cy.get('input[name="name"]').type(testData.testItems[0].name);
      cy.get('button[type="submit"]').contains('Create Item').click();
      
      // Button should show loading state briefly
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Wait for completion
      cy.get('.message').should('contain', 'Item created successfully');
      cy.get('button[type="submit"]').should('not.be.disabled');
    });
  });
});
