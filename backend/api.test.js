const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';

test('GET /api/health returns status ok and message', async () => {
  const response = await fetch(`${API_BASE}/health`);
  const data = await response.json();

  expect(data.status).toBe('ok');
  expect(data.message.toLowerCase()).toContain('api');
});
