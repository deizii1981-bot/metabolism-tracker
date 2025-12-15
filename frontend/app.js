const API = 'http://localhost:3000';
const $ = id => document.getElementById(id);

/* ---------- HELPERS ---------- */

function calculateAge(dob) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function updateBMIandBMR() {
  const h = $('record-height').value;
  const w = $('record-weight').value;
  const age = $('record-age').value;
  const select = $('patient-select');

  if (!h || !w || !age || !select.value) return;

  const gender = select.selectedOptions[0].dataset.gender;

  const bmi = (w / ((h / 100) ** 2)).toFixed(2);
  $('record-bmi').value = bmi;

  $('record-bmi-category').value =
    bmi < 18.5 ? 'Underweight' :
    bmi < 25 ? 'Normal' :
    bmi < 30 ? 'Overweight' : 'Obese';

  const bmr = gender === 'male'
    ? (10 * w + 6.25 * h - 5 * age + 5).toFixed(2)
    : (10 * w + 6.25 * h - 5 * age - 161).toFixed(2);

  $('record-bmr').value = bmr;
}

/* ---------- LOAD PATIENTS ---------- */

async function loadPatients() {
  const res = await fetch(`${API}/api/patients`);
  const patients = await res.json();

  const select = $('patient-select');
  select.innerHTML = '';

  patients.forEach(p => {
    const o = document.createElement('option');
    o.value = p.id;
    o.textContent = p.fullName;
    o.dataset.dob = p.dob;
    o.dataset.gender = p.gender.toLowerCase();
    select.appendChild(o);
  });

  // auto-select first patient
  if (patients.length) {
    select.selectedIndex = 0;
    select.dispatchEvent(new Event('change'));
  }
}

/* ---------- LOAD RECORDS ---------- */

async function loadRecords(patientId) {
  const res = await fetch(`${API}/api/patients/${patientId}/records`);
  const records = await res.json();

  const list = $('records-list');
  list.innerHTML = '';

  if (!records.length) {
    list.innerHTML = '<li>No previous records</li>';
    return;
  }

  records.forEach(r => {
    const li = document.createElement('li');
    li.textContent =
      `Height: ${r.height} cm | Weight: ${r.weightKg} kg | BMI: ${r.bmi} | BMR: ${r.bmr}`;
    list.appendChild(li);
  });
}

/* ---------- PATIENT SELECTION ---------- */

$('patient-select').addEventListener('change', e => {
  const selected = e.target.selectedOptions[0];
  if (!selected) return;

  $('record-age').value = calculateAge(selected.dataset.dob);
  updateBMIandBMR();
  loadRecords(selected.value);
});

/* ---------- ADD PATIENT ---------- */

$('add-patient-btn').addEventListener('click', async () => {
  const body = {
    fullName: $('patient-fullName').value,
    dob: $('patient-dob').value,
    gender: $('patient-gender').value,
    phone: $('patient-phone').value,
    email: $('patient-email').value
  };

  const res = await fetch(`${API}/api/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  $('message').textContent = res.ok ? 'Patient added' : 'Error';
  loadPatients();
});

/* ---------- INPUT LISTENERS ---------- */

$('record-height').addEventListener('input', updateBMIandBMR);
$('record-weight').addEventListener('input', updateBMIandBMR);

/* ---------- ADD RECORD ---------- */

$('add-record-btn').addEventListener('click', async () => {
  const select = $('patient-select');
  const patientId = select.value;

  if (!patientId) return;

  const body = {
    age: $('record-age').value,
    height: $('record-height').value,
    weightKg: $('record-weight').value,
    gender: select.selectedOptions[0].dataset.gender
  };

  await fetch(`${API}/api/patients/${patientId}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  loadRecords(patientId);
});

/* ---------- INIT ---------- */

loadPatients();
