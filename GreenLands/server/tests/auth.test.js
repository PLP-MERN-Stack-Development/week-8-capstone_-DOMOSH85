const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  it('should return 401 for invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'fake@example.com', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });
}); 