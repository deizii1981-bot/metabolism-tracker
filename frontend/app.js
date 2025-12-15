// Note: Initial structure and guidance assisted by ChatGPT;
// code was reviewed, modified, debugged, and extended me.

const API = '';   

const $ = id => document.getElementById(id);

/* ---------- CALCULATIONS ---------- */
const bmi = (h, w) => (w / ((h / 100) ** 2)).toFixed(2);

const bmr = (h, w, a, g) =>
  g === 'male'
    ? (10 * w + 6.25 * h - 5 * a + 5).toFixed(2)
    : (10 * w + 6.25 * h - 5 * a - 161).toFixed(2);

/* ---------- LOAD PATIENTS ---------- */
async function loadPatients() {
  try {
    const res = await fetch(`${API}/api/patients`);
    const patients = await res.json();

    const select = $('patient-select');
    select.innerHTML = '';

    patients.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.fullName;
      opt.dataset.dob = p.dob;
      opt.dataset.gender = p.gender.toLowerCase();
      select.appendChild(opt);
    });

    if (patients.length) {
      select.dispatchEvent(new Event('change'));
    }
  } catch (err) {
    console.error('Error loading patients:', err);
  }
}

/* ---------- LOAD RECORDS ---------- */
async function loadRecords(patientId) {
  try {
    const res = await fetch(`${API}/api/patients/${patientId}/records`);
    const records = await res.json();

    const list = $('records-list');
    list.innerHTML = '';

    if (!records.length) {
      list.innerHTML = '<li>No records found</li>';
      return;
    }

    records.forEach(r => {
      const li = document.createElement('li');
      li.innerHTML = `
        Height: ${r.height} cm |
        Weight: ${r.weightKg} kg |
        BMI: ${r.bmi} |
        BMR: ${r.bmr}
        <button onclick="editRecord(${r.id})">Update</button>
        <button onclick="deleteRecord(${r.id})">Delete</button>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Error loading records:', err);
  }
}

/* ---------- PATIENT SELECTION ---------- */
$('patient-select').onchange = e => {
  const selected = e.target.selectedOptions[0];
  if (!selected) return;

  const dob = new Date(selected.dataset.dob);
  const age = new Date().getFullYear() - dob.getFullYear();
  $('record-age').value = age;

  loadRecords(selected.value);
};

/* ---------- AUTO BMI / BMR ---------- */
$('record-height').oninput =
$('record-weight').oninput = () => {
  const h = $('record-height').value;
  const w = $('record-weight').value;
  const a = $('record-age').value;
  const selected = $('patient-select').selectedOptions[0];

  if (!h || !w || !a || !selected) return;

  const g = selected.dataset.gender;

  $('record-bmi').value = bmi(h, w);
  $('record-bmr').value = bmr(h, w, a, g);
};

/* ---------- ADD PATIENT ---------- */
$('add-patient-btn').onclick = async () => {
  try {
    await fetch(`${API}/api/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: $('patient-fullName').value,
        dob: $('patient-dob').value,
        gender: $('patient-gender').value,
        phone: $('patient-phone').value,
        email: $('patient-email').value
      })
    });

    loadPatients();
  } catch (err) {
    console.error('Error adding patient:', err);
  }
};

/* ---------- ADD RECORD ---------- */
$('add-record-btn').onclick = async () => {
  const selected = $('patient-select').selectedOptions[0];
  if (!selected) return;

  const h = $('record-height').value;
  const w = $('record-weight').value;
  const a = $('record-age').value;
  const g = selected.dataset.gender;

  try {
    await fetch(`${API}/api/patients/${selected.value}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        height: h,
        weightKg: w,
        bmi: bmi(h, w),
        bmr: bmr(h, w, a, g)
      })
    });

    loadRecords(selected.value);
  } catch (err) {
    console.error('Error adding record:', err);
  }
};

/* ---------- DELETE RECORD ---------- */
window.deleteRecord = async id => {
  try {
    await fetch(`${API}/api/records/${id}`, { method: 'DELETE' });
    $('patient-select').dispatchEvent(new Event('change'));
  } catch (err) {
    console.error('Error deleting record:', err);
  }
};

/* ---------- UPDATE RECORD (BASIC) ---------- */
window.editRecord = id => {
  alert('Update functionality can be extended further if required.');
};

/* ---------- INIT ---------- */
loadPatients();
