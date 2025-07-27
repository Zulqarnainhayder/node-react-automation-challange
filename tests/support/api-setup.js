// API Test Setup
const request = require('supertest');

// Global test configuration
global.API_BASE_URL = process.env.API_URL || 'http://localhost:4000';
global.TEST_TIMEOUT = 30000;

// Test data
global.TEST_USER = {
  username: 'test',
  password: 'password'
};

global.INVALID_USER = {
  username: 'wronguser',
  password: 'wrongpass'
};

global.TEST_ITEMS = [
  {
    name: 'API Test Item 1',
    description: 'This is a test item created via API testing'
  },
  {
    name: 'API Test Item 2',
    description: 'Another test item for API validation'
  },
  {
    name: 'API Test Item 3',
    description: ''
  }
];

// Helper function to get auth token
global.getAuthToken = async () => {
  const response = await request(global.API_BASE_URL)
    .post('/login')
    .send(global.TEST_USER)
    .expect(200);
  
  return response.body.token;
};

// Helper function to create test item
global.createTestItem = async (token, itemData) => {
  const response = await request(global.API_BASE_URL)
    .post('/items')
    .set('Authorization', `Bearer ${token}`)
    .send(itemData)
    .expect(201);
  
  return response.body;
};

// Helper function to cleanup test data
global.cleanupTestItems = async (token) => {
  try {
    const response = await request(global.API_BASE_URL)
      .get('/items')
      .set('Authorization', `Bearer ${token}`);
    
    if (response.body && response.body.length > 0) {
      for (const item of response.body) {
        await request(global.API_BASE_URL)
          .delete(`/items/${item.id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    }
  } catch (error) {
    console.log('Cleanup error (expected for empty database):', error.message);
  }
};

// Setup and teardown hooks
beforeAll(async () => {
  console.log('🚀 Starting API Tests...');
});

afterAll(async () => {
  console.log('✅ API Tests Completed!');
});
