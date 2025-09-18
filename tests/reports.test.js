// tests/reports.test.js
const request = require('supertest');
const app = require('../src/app');

// מדמה את שירות הדוחות
jest.mock('../src/services/report-compute.service', () => ({
  getMonthlyReport: jest.fn(),
}));
const { getMonthlyReport } = require('../src/services/report-compute.service');

describe('Reports endpoint', () => {
  test('GET /api/report validates query', async () => {
    const res = await request(app).get('/api/report');
    expect(res.status).toBe(400);
  });

  test('GET /api/report groups entries by category', async () => {
    getMonthlyReport.mockResolvedValue({
      userid: 1,
      year: 2025,
      month: 11,
      food: [
        { description: 'bread', sum: 10 },
        { description: 'milk', sum: 5 },
      ],
      health: [{ description: 'dentist', sum: 200 }],
      total: 215,
    });

    const res = await request(app).get('/api/report?id=1&year=2025&month=11');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.food)).toBe(true);
    expect(res.body.food.length).toBe(2);
    expect(res.body.health.length).toBe(1);
  });
});
