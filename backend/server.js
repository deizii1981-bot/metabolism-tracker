const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to our JSON "database"
const DB_PATH = path.join(__dirname, 'db.json');

// Helper: load database from file
function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    return { patients: [], records: [] };
  }

  const raw = fs.readFileSync(DB_PATH, 'utf8');

  if (!raw.trim()) {
    return { patients: [], records: [] };
  }

  return JSON.parse(raw);
}

// Helper: save database to file
function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Helper: generate next numeric ID
function getNextId(items) {
  if (!items || items.length === 0) {
    return 1;
  }
  const maxId = Math.max(...items.map(item => item.id));
  return maxId + 1;
}

// Simple test route
app.get('/', (req, res) => {
  res.send('Metabolism Tracker API is running with CRUD');
});

/*
  PATIENT ROUTES
*/

// GET all patients
app.get('/api/patients', (req, res) => {
  const db = loadDB();
  res.json(db.patients);
});

// CREATE new patient
app.post('/api/patients', (req, res) => {
  const { fullName, age, gender, phone, email } = req.body;

  if (!fullName || !age || !gender || !phone) {
    return res.status(400).json({ message: 'fullName, age, gender and phone are required.' });
  }

  const db = loadDB();

  const newPatient = {
    id: getNextId(db.patients),
    fullName,
    age,
    gender,
    phone,
    email: email || ''
  };

  db.patients.push(newPatient);
  saveDB(db);

  res.status(201).json(newPatient);
});

/*
  METABOLISM RECORD ROUTES
*/

// GET all records for a patient
app.get('/api/patients/:id/records', (req, res) => {
  const patientId = parseInt(req.params.id, 10);
  const db = loadDB();

  const patient = db.patients.find(p => p.id === patientId);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  const patientRecords = db.records.filter(r => r.patientId === patientId);
  res.json(patientRecords);
});

// CREATE a new metabolism record for a patient
app.post('/api/patients/:id/records', (req, res) => {
  const patientId = parseInt(req.params.id, 10);
  const { date, weightKg, bmi, bmr, notes } = req.body;

  if (!date || !weightKg || !bmi || !bmr) {
    return res.status(400).json({ message: 'date, weightKg, bmi and bmr are required.' });
  }

  const db = loadDB();

  const patient = db.patients.find(p => p.id === patientId);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  const newRecord = {
    id: getNextId(db.records),
    patientId,
    date,
    weightKg,
    bmi,
    bmr,
    notes: notes || ''
  };

  db.records.push(newRecord);
  saveDB(db);

  res.status(201).json(newRecord);
});

// UPDATE an existing metabolism record
app.put('/api/records/:recordId', (req, res) => {
  const recordId = parseInt(req.params.recordId, 10);
  const { date, weightKg, bmi, bmr, notes } = req.body;

  const db = loadDB();
  const recordIndex = db.records.findIndex(r => r.id === recordId);

  if (recordIndex === -1) {
    return res.status(404).json({ message: 'Record not found' });
  }

  const existing = db.records[recordIndex];

  db.records[recordIndex] = {
    ...existing,
    date: date || existing.date,
    weightKg: weightKg ?? existing.weightKg,
    bmi: bmi ?? existing.bmi,
    bmr: bmr ?? existing.bmr,
    notes: notes ?? existing.notes
  };

  saveDB(db);

  res.json(db.records[recordIndex]);
});

// DELETE a metabolism record
app.delete('/api/records/:recordId', (req, res) => {
  const recordId = parseInt(req.params.recordId, 10);
  const db = loadDB();

  const recordIndex = db.records.findIndex(r => r.id === recordId);

  if (recordIndex === -1) {
    return res.status(404).json({ message: 'Record not found' });
  }

  const deleted = db.records.splice(recordIndex, 1)[0];
  saveDB(db);

  res.json({ message: 'Record deleted', record: deleted });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
