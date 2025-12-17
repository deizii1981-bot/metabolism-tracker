// Initial structure assisted by ChatGPT.
// Reviewed, modified, and implemented by the author.

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/* ---------- DATABASE ---------- */
const DB_PATH = process.env.RENDER
  ? '/data/db.json'
  : path.join(__dirname, 'db.json');

function loadDB() {
  if (!fs.existsSync(DB_PATH)) return { patients: [], records: [] };
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function nextId(list) {
  return list.length ? Math.max(...list.map(i => i.id)) + 1 : 1;
}

/* ---------- API ROUTES FIRST ---------- */

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API running' });
});

app.get('/api/patients', (req, res) => {
  res.json(loadDB().patients);
});

app.post('/api/patients', (req, res) => {
  const db = loadDB();
  const patient = { id: nextId(db.patients), ...req.body };
  db.patients.push(patient);
  saveDB(db);
  res.status(201).json(patient);
});

app.get('/api/patients/:id/records', (req, res) => {
  const db = loadDB();
  res.json(db.records.filter(r => r.patientId == req.params.id));
});

app.post('/api/patients/:id/records', (req, res) => {
  const db = loadDB();
  const record = {
    id: nextId(db.records),
    patientId: Number(req.params.id),
    ...req.body
  };
  db.records.push(record);
  saveDB(db);
  res.status(201).json(record);
});

/* ---------- FRONTEND LAST ---------- */
const FRONTEND_PATH = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_PATH));

app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
