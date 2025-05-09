const db = require('../data/dbConfig.js');
const request = require('supertest');
const server = require('./server.js');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

describe('[GET] /hobbits', () => {
  test('responds with 200 OK', async () => {
    const res = await request(server).get('/hobbits');
    expect(res.status).toBe(200);
  });

  test('responds with all hobbits', async () => {
    const res = await request(server).get('/hobbits');
    expect(res.body).toHaveLength(4);
  });
});

describe('[POST] /hobbits', () => {
  const bilbo = { name: 'Bilbo' };

  test('adds a hobbit to the database', async () => {
    await request(server).post('/hobbits').send(bilbo);
    expect(await db('hobbits')).toHaveLength(5);
  });

  test('responds with the new hobbit', async () => {
    const res = await request(server).post('/hobbits').send(bilbo);
    expect(res.body).toMatchObject(bilbo);
  });

  test('fails when required fields are missing', async () => {
    const res = await request(server).post('/hobbits').send({});
    expect(res.status).toBe(400);
  });
});

describe('[DELETE] /hobbits/:id', () => {
  test('deletes a hobbit successfully', async () => {
    await request(server).delete('/hobbits/1');
    const hobbitsAfterDelete = await db('hobbits');
    expect(hobbitsAfterDelete).toHaveLength(3);
  });

  test('responds with 404 if hobbit not found', async () => {
    const res = await request(server).delete('/hobbits/999');
    expect(res.status).toBe(404);
  });
});
