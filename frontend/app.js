//this code was taken by ghatgpt and then modified by me for small requirements.
// Note: Initial structure and guidance assisted by ChatGPT; code was reviewed, modified, and extended by the author.

const API = 'http://localhost:3000';
const $ = id => document.getElementById(id);

/* ---------- HELPERS ---------- */

function calculateAge(dob) {
  const b = new Date(dob), t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  if (t < new Date(b.setFullYear(t.getFullYear()))) a--;
  return a;
}

function calcBMI(h, w) {
  return (w / ((h / 100) ** 2)).toFixed(2);
}

function calcBMR(h, w, a, g) {
  return g === 'male'
    ? (10*w + 6.25*h - 5*a + 5).toFixed(2)
    : (10*w + 6.25*h - 5*a - 161).toFixed(2);
}

/* ---------- LOAD PATIENTS ---------- */

async function loadPatients() {
  const p = await (await fetch(`${API}/api/patients`)).json();
  const s = $('patient-select');
  s.innerHTML = '';
  p.forEach(x => {
    const o = document.createElement('option');
    o.value = x.id;
    o.textContent = x.fullName;
    o.dataset.dob = x.dob;
    o.dataset.gender = x.gender.toLowerCase();
    s.appendChild(o);
  });
  if (p.length) s.dispatchEvent(new Event('change'));
}

/* ---------- LOAD RECORDS ---------- */

async function loadRecords(pid) {
  const records = await (await fetch(`${API}/api/patients/${pid}/records`)).json();
  const ul = $('records-list');
  ul.innerHTML = '';

  if (!records.length) {
    ul.innerHTML = '<li>No records</li>';
    return;
  }

  records.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `
      H:${r.height}cm W:${r.weightKg}kg BMI:${r.bmi} BMR:${r.bmr}
      <button onclick="editRecord(${r.id}, ${r.height}, ${r.weightKg})">Update</button>
      <button onclick="deleteRecord(${r.id})">Delete</button>
    `;
    ul.appendChild(li);
  });
}

/* ---------- RECORD ACTIONS ---------- */

window.deleteRecord = async id => {
  await fetch(`${API}/api/records/${id}`, { method: 'DELETE' });
  $('patient-select').dispatchEvent(new Event('change'));
};

window.editRecord = async (id, h, w) => {
  const height = prompt('New height (cm):', h);
  const weight = prompt('New weight (kg):', w);
  if (!height || !weight) return;

  const age = $('record-age').value;
  const gender = $('patient-select').selectedOptions[0].dataset.gender;

  await fetch(`${API}/api/records/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      height,
      weightKg: weight,
      bmi: calcBMI(height, weight),
      bmr: calcBMR(height, weight, age, gender)
    })
  });

  $('patient-select').dispatchEvent(new Event('change'));
};

/* ---------- EVENTS ---------- */

$('patient-select').onchange = e => {
  const o = e.target.selectedOptions[0];
  $('record-age').value = calculateAge(o.dataset.dob);
  loadRecords(o.value);
};

$('record-height').oninput =
$('record-weight').oninput = () => {
  const h = $('record-height').value;
  const w = $('record-weight').value;
  const a = $('record-age').value;
  const g = $('patient-select').selectedOptions[0]?.dataset.gender;
  if (!h || !w || !a || !g) return;
  $('record-bmi').value = calcBMI(h, w);
  $('record-bmr').value = calcBMR(h, w, a, g);
};

$('add-record-btn').onclick = async () => {
  const pid = $('patient-select').value;
  const h = $('record-height').value;
  const w = $('record-weight').value;
  const a = $('record-age').value;
  const g = $('patient-select').selectedOptions[0].dataset.gender;

  await fetch(`${API}/api/patients/${pid}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      height: h,
      weightKg: w,
      bmi: calcBMI(h, w),
      bmr: calcBMR(h, w, a, g)
    })
  });

  loadRecords(pid);
};

loadPatients();
