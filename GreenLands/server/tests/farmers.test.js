const request = require('supertest');
const app = require('../app');

describe('Farmers API', () => {
  it('should require authentication for protected routes', async () => {
    const res = await request(app)
      .get('/api/farmers/profile');
    expect(res.statusCode).toBe(401);
  });
}); 