const request = require('supertest');

describe('CRUD Operations API Tests', () => {
  let authToken;

  beforeAll(async () => {
    authToken = await global.getAuthToken();
  });

  beforeEach(async () => {
    // Clean up items before each test
    await global.cleanupTestItems(authToken);
  });

  afterAll(async () => {
    // Final cleanup
    await global.cleanupTestItems(authToken);
  });

  describe('GET /items', () => {
    it('should return empty array when no items exist', async () => {
      const response = await request(global.API_BASE_URL)
        .get('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should return all items for authenticated user', async () => {
      // Create test items
      const testItems = global.TEST_ITEMS.slice(0, 2);
      for (const item of testItems) {
        await global.createTestItem(authToken, item);
      }

      const response = await request(global.API_BASE_URL)
        .get('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      
      // Verify item structure
      response.body.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('created_at');
        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
      });
    });

    it('should require authentication', async () => {
      const response = await request(global.API_BASE_URL)
        .get('/items')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Access token required');
    });
  });

  describe('POST /items', () => {
    it('should create item with name and description', async () => {
      const newItem = global.TEST_ITEMS[0];

      const response = await request(global.API_BASE_URL)
        .post('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newItem)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newItem.name);
      expect(response.body.description).toBe(newItem.description);
      expect(response.body).toHaveProperty('created_at');
    });

    it('should create item with name only', async () => {
      const newItem = { name: 'Test Item Name Only' };

      const response = await request(global.API_BASE_URL)
        .post('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newItem)
        .expect(201);

      expect(response.body.name).toBe(newItem.name);
      expect(response.body.description).toBe('');
    });

    it('should reject item creation without name', async () => {
      const invalidItem = { description: 'Description without name' };

      const response = await request(global.API_BASE_URL)
        .post('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidItem)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Name is required');
    });

    it('should reject item creation with empty name', async () => {
      const invalidItem = { name: '', description: 'Test description' };

      const response = await request(global.API_BASE_URL)
        .post('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidItem)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle special characters in item data', async () => {
      const specialItem = {
        name: 'Test Item with "quotes" & symbols!',
        description: 'Description with <tags> and special chars: @#$%^&*()'
      };

      const response = await request(global.API_BASE_URL)
        .post('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(specialItem)
        .expect(201);

      expect(response.body.name).toBe(specialItem.name);
      expect(response.body.description).toBe(specialItem.description);
    });

    it('should require authentication', async () => {
      const newItem = global.TEST_ITEMS[0];

      const response = await request(global.API_BASE_URL)
        .post('/items')
        .send(newItem)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(global.API_BASE_URL)
        .post('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send('invalid json')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /items/:id', () => {
    let testItem;

    beforeEach(async () => {
      testItem = await global.createTestItem(authToken, global.TEST_ITEMS[0]);
    });

    it('should update item successfully', async () => {
      const updatedData = {
        name: 'Updated Item Name',
        description: 'Updated description'
      };

      const response = await request(global.API_BASE_URL)
        .put(`/items/${testItem.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.id).toBe(testItem.id);
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.description).toBe(updatedData.description);
    });

    it('should update item with partial data', async () => {
      const updatedData = { name: 'Only Name Updated' };

      const response = await request(global.API_BASE_URL)
        .put(`/items/${testItem.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.description).toBe(testItem.description); // Should remain unchanged
    });

    it('should reject update without name', async () => {
      const invalidData = { name: '', description: 'Updated description' };

      const response = await request(global.API_BASE_URL)
        .put(`/items/${testItem.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent item', async () => {
      const updatedData = { name: 'Updated Name' };

      const response = await request(global.API_BASE_URL)
        .put('/items/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Item not found');
    });

    it('should require authentication', async () => {
      const updatedData = { name: 'Updated Name' };

      const response = await request(global.API_BASE_URL)
        .put(`/items/${testItem.id}`)
        .send(updatedData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid item ID format', async () => {
      const updatedData = { name: 'Updated Name' };

      const response = await request(global.API_BASE_URL)
        .put('/items/invalid_id')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /items/:id', () => {
    let testItem;

    beforeEach(async () => {
      testItem = await global.createTestItem(authToken, global.TEST_ITEMS[0]);
    });

    it('should delete item successfully', async () => {
      const response = await request(global.API_BASE_URL)
        .delete(`/items/${testItem.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Item deleted successfully');

      // Verify item is actually deleted
      const getResponse = await request(global.API_BASE_URL)
        .get('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body).toHaveLength(0);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(global.API_BASE_URL)
        .delete('/items/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Item not found');
    });

    it('should require authentication', async () => {
      const response = await request(global.API_BASE_URL)
        .delete(`/items/${testItem.id}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid item ID format', async () => {
      const response = await request(global.API_BASE_URL)
        .delete('/items/invalid_id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete CRUD workflow', async () => {
      // Create
      const createResponse = await request(global.API_BASE_URL)
        .post('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(global.TEST_ITEMS[0])
        .expect(201);

      const itemId = createResponse.body.id;

      // Read
      const getResponse = await request(global.API_BASE_URL)
        .get('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body).toHaveLength(1);
      expect(getResponse.body[0].id).toBe(itemId);

      // Update
      const updatedData = { name: 'Updated Name', description: 'Updated Description' };
      const updateResponse = await request(global.API_BASE_URL)
        .put(`/items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);

      expect(updateResponse.body.name).toBe(updatedData.name);

      // Delete
      await request(global.API_BASE_URL)
        .delete(`/items/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify deletion
      const finalGetResponse = await request(global.API_BASE_URL)
        .get('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(finalGetResponse.body).toHaveLength(0);
    });

    it('should handle multiple items operations', async () => {
      // Create multiple items
      const createdItems = [];
      for (const item of global.TEST_ITEMS.slice(0, 3)) {
        const response = await global.createTestItem(authToken, item);
        createdItems.push(response);
      }

      // Verify all items exist
      const getResponse = await request(global.API_BASE_URL)
        .get('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body).toHaveLength(3);

      // Update middle item
      const updatedData = { name: 'Updated Middle Item' };
      await request(global.API_BASE_URL)
        .put(`/items/${createdItems[1].id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);

      // Delete first and last items
      await request(global.API_BASE_URL)
        .delete(`/items/${createdItems[0].id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      await request(global.API_BASE_URL)
        .delete(`/items/${createdItems[2].id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify only middle item remains
      const finalResponse = await request(global.API_BASE_URL)
        .get('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(finalResponse.body).toHaveLength(1);
      expect(finalResponse.body[0].name).toBe(updatedData.name);
    });

    it('should maintain data consistency across operations', async () => {
      // Create item
      const createResponse = await global.createTestItem(authToken, global.TEST_ITEMS[0]);
      const originalCreatedAt = createResponse.created_at;

      // Update item multiple times
      for (let i = 1; i <= 3; i++) {
        const updateResponse = await request(global.API_BASE_URL)
          .put(`/items/${createResponse.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: `Updated Name ${i}` })
          .expect(200);

        // Verify ID and created_at remain unchanged
        expect(updateResponse.body.id).toBe(createResponse.id);
        expect(updateResponse.body.created_at).toBe(originalCreatedAt);
        expect(updateResponse.body.name).toBe(`Updated Name ${i}`);
      }
    });
  });
});
