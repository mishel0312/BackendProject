process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/models/users.model', () => ({
  findOne: jest.fn(),
}));
jest.mock('../src/models/costs.model', () => ({
  create: jest.fn(),
}));

const User = require('../src/models/users.model');
const Cost = require('../src/models/costs.model');

describe('Costs endpoint', () => {
  test('POST /api/add (cost) validates body', async () => {
    const res = await request(app).post('/api/add').send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('POST /api/add (cost) requires existing user', async () => {
    User.findOne.mockResolvedValue(null);
    const res = await request(app)
      .post('/api/add')
      .send({ description: 'bread', category: 'food', userid: 1, sum: 10 });
    expect(res.status).toBe(404);
  });

  test('POST /api/add (cost) creates cost', async () => {
    User.findOne.mockResolvedValue({ id: 1 });
    Cost.create.mockResolvedValue({ description: 'bread', category: 'food', userid: 1, sum: 10 });
    const res = await request(app)
      .post('/api/add')
      .send({ description: 'bread', category: 'food', userid: 1, sum: 10 });
    expect(res.status).toBe(201);
    expect(res.body.userid).toBe(1);
  });
});


