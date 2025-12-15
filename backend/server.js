
// code was reviewed, modified, and extended by the me

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const FRONTEND_PATH = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_PATH));

app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

const DB_PATH = path.join(__dirname, 'db.json');

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

/* ---------- PATIENTS ---------- */

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

/* ---------- RECORDS ---------- */

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

app.put('/api/records/:id', (req, res) => {
  const db = loadDB();
  const rec = db.records.find(r => r.id == req.params.id);
  if (!rec) return res.sendStatus(404);
  Object.assign(rec, req.body);
  saveDB(db);
  res.json(rec);
});

app.delete('/api/records/:id', (req, res) => {
  const db = loadDB();
  db.records = db.records.filter(r => r.id != req.params.id);
  saveDB(db);
  res.sendStatus(204);
});

app.listen(PORT, () =>
  console.log(`✅ Backend running at http://localhost:${PORT}`)
);
