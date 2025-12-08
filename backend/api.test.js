const fetch = require('node-fetch');

const API_BASE = "http://localhost:3000";

// Integration Test: Check root endpoint
test("GET / returns API running message", async () => {
  const res = await fetch(`${API_BASE}/`);
  const text = await res.text();

  expect(text.toLowerCase()).toContain("api");
});


test("GET /health returns status ok and message", async () => {
  const response = await fetch(`${API_BASE}/health`);
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.status).toBe("ok");
  expect(data.message).toMatch(/Metabolism tracker API is running/i);
});
