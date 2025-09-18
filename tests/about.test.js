process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../src/app');

describe('About endpoint', () => {
  test('GET /api/about returns team names only', async () => {
    const res = await request(app).get('/api/about');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('first_name');
    expect(res.body[0]).toHaveProperty('last_name');
  });
});


