const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/services/report-compute.service', () => ({
  getMonthlyReport: jest.fn(),
}));
const { getMonthlyReport } = require('../src/services/report-compute.service');

describe('Reports endpoint', () => {
  // Should fail with 400 when missing required query params
  test('GET /api/report validates query', async () => {
    const res = await request(app).get('/api/report');
    expect(res.status).toBe(400);
  });

  // Should return grouped costs by category from the mock
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
