const request = require('supertest');
const app = require('./server');

describe('Jira link endpoints', () => {
  test('GET /api/jira-status always reports "failure 1" deterministically across repeated calls (regression: read must not increment shared state)', async () => {
    const first = await request(app).get('/api/jira-status');
    const second = await request(app).get('/api/jira-status');
    const third = await request(app).get('/api/jira-status');

    expect(first.body.message).toBe('Jira integration is not configured (failure 1)');
    expect(second.body.message).toBe('Jira integration is not configured (failure 1)');
    expect(third.body.message).toBe('Jira integration is not configured (failure 1)');
    expect(first.body.attempts).toBe(1);
    expect(second.body.attempts).toBe(1);
    expect(third.body.attempts).toBe(1);
  });

  test('GET /api/jira-status returns a failure status with an attempt count when Jira is unconfigured', async () => {
    const res = await request(app).get('/api/jira-status');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(typeof res.body.attempts).toBe('number');
    expect(res.body.message).toMatch(/failure \d+/i);
  });

  test('POST /api/jira-link without issueKey returns 400 with a failure message', async () => {
    const res = await request(app).post('/api/jira-link').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/failure \d+/i);
  });

  test('POST /api/jira-link with an issueKey but no Jira config returns 503 with a failure message', async () => {
    const res = await request(app).post('/api/jira-link').send({ issueKey: 'PROJ-123' });
    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/failure \d+/i);
  });

  test('existing /api/pokemons route is unaffected by the new Jira routes', async () => {
    const res = await request(app).get('/api/pokemons');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
