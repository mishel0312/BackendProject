process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/models/users.model', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
}));
jest.mock('../src/models/costs.model', () => ({
  aggregate: jest.fn(),
}));

const User = require('../src/models/users.model');
const Cost = require('../src/models/costs.model');

describe('Users endpoints', () => {
  // Should fail with 400 when body is empty or invalid
  test('POST /api/add (user) validates body', async () => {
    const res = await request(app).post('/api/add').send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  // Should create a new user and return 201
  test('POST /api/add (user) creates user', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 1, first_name: 'Alice', last_name: 'Doe' });
    const res = await request(app)
      .post('/api/add')
      .send({ id: 1, first_name: 'Alice', last_name: 'Doe' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(1);
  });

  // Should return one user including computed total
  test('GET /api/users/:id returns user with total', async () => {
    User.findOne.mockResolvedValue({ id: 1, first_name: 'Alice', last_name: 'Doe' });
    Cost.aggregate.mockResolvedValue([{ _id: null, total: 50 }]);
    const res = await request(app).get('/api/users/1');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(50);
  });

  // Should return all users as an array
  test('GET /api/users lists users', async () => {
    User.find.mockResolvedValue([{ id: 1, first_name: 'Alice', last_name: 'Doe' }]);
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
