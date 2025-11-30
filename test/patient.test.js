const fs = require('fs');
const path = require('path');

// Unit Test: Check if database JSON loads successfully
test("Database should load JSON successfully", () => {
  const dbPath = path.join(__dirname, '..', 'backend', 'db.json');
  const exists = fs.existsSync(dbPath);

  expect(exists).toBe(true);

  const raw = fs.readFileSync(dbPath, 'utf8');
  const data = JSON.parse(raw);

  expect(data).toHaveProperty("patients");
  expect(data).toHaveProperty("records");
});
