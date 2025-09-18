process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/models/logs.model', () => ({
  find: jest.fn(() => ({ sort: jest.fn(() => ({ lean: jest.fn().mockResolvedValue([]) })) })),
}));

describe('Logs endpoint', () => {
  // Should return 200 and an array of logs
  test('GET /api/logs returns array', async () => {
    const res = await request(app).get('/api/logs');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
