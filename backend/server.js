console.log("🔥 THIS IS THE ACTIVE SERVER.JS FILE 🔥");
// Metabolism Tracker Backend API
// the code was changed/modified/improved  with the help of chatgpt 

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

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
  const p = { id: nextId(db.patients), ...req.body };
  db.patients.push(p);
  saveDB(db);
  res.status(201).json(p);
});

/* ---------- RECORDS ---------- */

app.get('/api/patients/:id/records', (req, res) => {
  const db = loadDB();
  res.json(db.records.filter(r => r.patientId == req.params.id));
});

app.post('/api/patients/:id/records', (req, res) => {
  const db = loadDB();
  const r = {
    id: nextId(db.records),
    patientId: Number(req.params.id),
    ...req.body
  };
  db.records.push(r);
  saveDB(db);
  res.status(201).json(r);
});

/* ✅ UPDATE RECORD */
app.put('/api/records/:id', (req, res) => {
  const db = loadDB();
  const rec = db.records.find(r => r.id == req.params.id);
  if (!rec) return res.sendStatus(404);

  Object.assign(rec, req.body);
  saveDB(db);
  res.json(rec);
});

/* ✅ DELETE RECORD */
app.delete('/api/records/:id', (req, res) => {
  const db = loadDB();
  db.records = db.records.filter(r => r.id != req.params.id);
  saveDB(db);
  res.sendStatus(204);
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () =>
  console.log(`✅ Backend running at http://localhost:${PORT}`)
);
