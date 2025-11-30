const fetch = require('node-fetch');

const API_BASE = "http://localhost:3000";

// Integration Test: Check root endpoint
test("GET / returns API running message", async () => {
  const res = await fetch(`${API_BASE}/`);
  const text = await res.text();

  expect(text.toLowerCase()).toContain("api");
});
