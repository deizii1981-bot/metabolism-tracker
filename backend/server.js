console.log("🔥 THIS IS THE ACTIVE SERVER.JS FILE 🔥");
// Metabolism Tracker Backend API
// DBS – Programming for Information Systems
// Option A: Serve frontend from ../frontend

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ ROOT ROUTE MUST BE HERE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
// DEBUG: check if frontend index.html exists
app.get('/debug-path', (req, res) => {
  const fullPath = path.join(__dirname, '../frontend/index.html');
  res.json({
    exists: fs.existsSync(fullPath),
    path: fullPath
  });
});

// ---------- DATABASE ----------
const DB_PATH = path.join(__dirname, 'db.json');

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    return { patients: [], records: [] };
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function nextId(list) {
  return list.length ? Math.max(...list.map(i => i.id)) + 1 : 1;
}

// ---------- BUSINESS LOGIC ----------
function calculateBMI(weight, height) {
  return +(weight / ((height / 100) ** 2)).toFixed(2);
}

function calculateBMR(weight, height, age, gender) {
  return gender === 'male'
    ? +(10 * weight + 6.25 * height - 5 * age + 5).toFixed(2)
    : +(10 * weight + 6.25 * height - 5 * age - 161).toFixed(2);
}

// ---------- PATIENT ROUTES ----------

// READ all patients
app.get('/api/patients', (req, res) => {
  res.json(loadDB().patients);
});

// CREATE patient
app.post('/api/patients', (req, res) => {
  const { fullName, dob, gender, phone, email, activityLevel } = req.body;

  if (!fullName || !dob || !gender || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const db = loadDB();

  const patient = {
    id: nextId(db.patients),
    fullName,
    dob,
    gender,
    phone,
    email: email || '',
    activityLevel: activityLevel || ''
  };

  db.patients.push(patient);
  saveDB(db);

  res.status(201).json(patient);
});

// DELETE patient
app.delete('/api/patients/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = loadDB();

  db.patients = db.patients.filter(p => p.id !== id);
  db.records = db.records.filter(r => r.patientId !== id);

  saveDB(db);
  res.json({ message: 'Patient deleted' });
});

// ---------- RECORD ROUTES ----------

// READ patient records
app.get('/api/patients/:id/records', (req, res) => {
  const id = Number(req.params.id);
  const db = loadDB();

  res.json(db.records.filter(r => r.patientId === id));
});

// CREATE record
app.post('/api/patients/:id/records', (req, res) => {
  const patientId = Number(req.params.id);
  const { height, weightKg, age, gender, notes } = req.body;

  if (!height || !weightKg || !age || !gender) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const bmi = calculateBMI(weightKg, height);
  const bmr = calculateBMR(weightKg, height, age, gender);

  const db = loadDB();

  const record = {
    id: nextId(db.records),
    patientId,
    height,
    weightKg,
    bmi,
    bmr,
    notes: notes || ''
  };

  db.records.push(record);
  saveDB(db);

  res.status(201).json(record);
});

// ---------- HEALTH CHECK ----------
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
