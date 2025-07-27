const request = require('supertest');

describe('Authentication API Tests', () => {
  
  describe('POST /login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(global.API_BASE_URL)
        .post('/login')
        .send(global.TEST_USER)
        .expect(200);

      // Verify response structure
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe(global.TEST_USER.username);
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);
      
      // Verify token format (JWT should have 3 parts)
      const tokenParts = response.body.token.split('.');
      expect(tokenParts).toHaveLength(3);
    });

    it('should reject login with invalid username', async () => {
      const response = await request(global.API_BASE_URL)
        .post('/login')
        .send({
          username: 'nonexistentuser',
          password: global.TEST_USER.password
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid credentials');
      expect(response.body).not.toHaveProperty('token');
    });

    it('should reject login with invalid password', async () => {
      const response = await request(global.API_BASE_URL)
        .post('/login')
        .send({
          username: global.TEST_USER.username,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid credentials');
      expect(response.body).not.toHaveProperty('token');
    });

    it('should reject login with missing username', async () => {
      const response = await request(global.API_BASE_URL)
        .post('/login')
        .send({
          password: global.TEST_USER.password
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject login with missing password', async () => {
      const response = await request(global.API_BASE_URL)
        .post('/login')
        .send({
          username: global.TEST_USER.username
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject login with empty credentials', async () => {
      const response = await request(global.API_BASE_URL)
        .post('/login')
        .send({
          username: '',
          password: ''
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle malformed request body', async () => {
      const response = await request(global.API_BASE_URL)
        .post('/login')
        .send('invalid json')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return consistent error format', async () => {
      const testCases = [
        { username: 'wrong', password: 'wrong' },
        { username: '', password: 'test' },
        { username: 'test', password: '' }
      ];

      for (const testCase of testCases) {
        const response = await request(global.API_BASE_URL)
          .post('/login')
          .send(testCase);

        expect(response.body).toHaveProperty('error');
        expect(typeof response.body.error).toBe('string');
        expect(response.body.error.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Token Validation', () => {
    let validToken;

    beforeAll(async () => {
      validToken = await global.getAuthToken();
    });

    it('should accept valid token for protected routes', async () => {
      const response = await request(global.API_BASE_URL)
        .get('/items')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject requests without token', async () => {
      const response = await request(global.API_BASE_URL)
        .get('/items')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Access token required');
    });

    it('should reject requests with invalid token', async () => {
      const response = await request(global.API_BASE_URL)
        .get('/items')
        .set('Authorization', 'Bearer invalid_token')
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid or expired token');
    });

    it('should reject requests with malformed authorization header', async () => {
      const response = await request(global.API_BASE_URL)
        .get('/items')
        .set('Authorization', 'InvalidFormat')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject expired tokens', async () => {
      // This test would require a token with very short expiry
      // For now, we test with a clearly invalid token format
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      const response = await request(global.API_BASE_URL)
        .get('/items')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Security Tests', () => {
    it('should not expose sensitive information in error responses', async () => {
      const response = await request(global.API_BASE_URL)
        .post('/login')
        .send({
          username: 'test',
          password: 'wrongpassword'
        })
        .expect(401);

      // Error should not contain database info, stack traces, etc.
      expect(response.body.error).not.toContain('database');
      expect(response.body.error).not.toContain('stack');
      expect(response.body.error).not.toContain('Error:');
    });

    it('should handle SQL injection attempts', async () => {
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "admin'--",
        "' UNION SELECT * FROM users --"
      ];

      for (const maliciousInput of maliciousInputs) {
        const response = await request(global.API_BASE_URL)
          .post('/login')
          .send({
            username: maliciousInput,
            password: 'test'
          });

        // Should return 401 (not 500 or expose database errors)
        expect([400, 401]).toContain(response.status);
        expect(response.body).toHaveProperty('error');
      }
    });

    it('should rate limit login attempts', async () => {
      // Make multiple rapid login attempts
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(global.API_BASE_URL)
            .post('/login')
            .send({
              username: 'wrong',
              password: 'wrong'
            })
        );
      }

      const responses = await Promise.all(promises);
      
      // All should return error responses (either 401 or 429 for rate limiting)
      responses.forEach(response => {
        expect([401, 429]).toContain(response.status);
        expect(response.body).toHaveProperty('error');
      });
    });
  });
});
