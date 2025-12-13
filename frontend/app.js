const API_BASE = 'http://localhost:3000';

/* ---------------------- ELEMENT REFERENCES ---------------------- */
const patientFullNameInput = document.getElementById('patient-fullName');
const patientAgeInput = document.getElementById('patient-age');
const patientGenderSelect = document.getElementById('patient-gender');
const patientPhoneInput = document.getElementById('patient-phone');
const patientEmailInput = document.getElementById('patient-email');
const patientActivityLevelSelect = document.getElementById('patient-activityLevel');

const addPatientBtn = document.getElementById('add-patient-btn');
const refreshPatientsBtn = document.getElementById('refresh-patients-btn');
const patientSearchInput = document.getElementById('patient-search');
const patientSelect = document.getElementById('patient-select');

const selectedPatientLabel = document.getElementById('selected-patient-label');
const recordDateInput = document.getElementById('record-date');  // DOB
const recordHeightInput = document.getElementById('record-height');
const recordWeightInput = document.getElementById('record-weight');
const recordBmiInput = document.getElementById('record-bmi');
const bmiCategorySelect = document.getElementById('bmi-category');
const recordBmrInput = document.getElementById('record-bmr');
const recordNotesInput = document.getElementById('record-notes');
const addRecordBtn = document.getElementById('add-record-btn');

const recordsTableBody = document.getElementById('records-table-body');
const messageElement = document.getElementById('message');

/* ---------------------- MESSAGE HANDLER ---------------------- */
function showMessage(text, isError = false) {
  messageElement.textContent = text;
  messageElement.style.color = isError ? 'red' : 'green';

  if (text) {
    setTimeout(() => {
      messageElement.textContent = '';
    }, 3000);
  }
}

/* --------------------- BMI CALCULATION ------------------------ */
function updateBMI() {
  const weight = parseFloat(recordWeightInput.value);
  const heightCm = parseFloat(recordHeightInput.value);

  if (!isNaN(weight) && !isNaN(heightCm) && heightCm > 0) {
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    const bmiRounded = bmi.toFixed(1);

    recordBmiInput.value = bmiRounded;
    autoSelectBmiCategory(bmiRounded);
  }
}

/* -------------- Auto-select BMI category ------------------- */
function autoSelectBmiCategory(bmi) {
  const value = parseFloat(bmi);

  if (value < 18.5) bmiCategorySelect.value = "Underweight";
  else if (value < 25) bmiCategorySelect.value = "Healthy Weight";
  else if (value < 30) bmiCategorySelect.value = "Overweight";
  else if (value < 35) bmiCategorySelect.value = "Obesity Class 1";
  else if (value < 40) bmiCategorySelect.value = "Obesity Class 2";
  else bmiCategorySelect.value = "Obesity Class 3";
}

/* ----------------------- LOAD PATIENTS ------------------------ */
let allPatients = [];

async function loadPatients() {
  try {
    const response = await fetch(`${API_BASE}/api/patients`);
    allPatients = await response.json();

    renderPatientList(allPatients);
  } catch (err) {
    console.error(err);
    showMessage('Failed to load patients', true);
  }
}

/* ----------------------- RENDER PATIENT LIST ------------------ */
function renderPatientList(patients) {
  patientSelect.innerHTML = "";

  patients.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.fullName} (ID: ${p.id})`;
    patientSelect.appendChild(option);
  });
}

/* ----------------------- SEARCH PATIENTS ---------------------- */
patientSearchInput.addEventListener("input", () => {
  const query = patientSearchInput.value.toLowerCase();

  const filtered = allPatients.filter(p =>
    p.fullName.toLowerCase().includes(query)
  );

  renderPatientList(filtered);
});

/* ----------------------- ADD PATIENT -------------------------- */
async function addPatient() {
  const fullName = patientFullNameInput.value.trim();
  const age = parseInt(patientAgeInput.value);
  const gender = patientGenderSelect.value;
  const phone = patientPhoneInput.value.trim();
  const email = patientEmailInput.value.trim();
  const activityLevel = patientActivityLevelSelect.value;

  if (!fullName || !age || !gender || !phone) {
    showMessage("Full name, age, gender and phone are required.", true);
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        age,
        gender,
        phone,
        email,
        activityLevel
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      showMessage(errData.message || "Error adding patient", true);
      return;
    }

    showMessage("Patient added successfully!");

    // Clear form
    patientFullNameInput.value = "";
    patientAgeInput.value = "";
    patientGenderSelect.value = "";
    patientPhoneInput.value = "";
    patientEmailInput.value = "";
    patientActivityLevelSelect.value = "";

    loadPatients(); // refresh list live
  } catch (err) {
    console.error(err);
    showMessage("Error adding patient", true);
  }
}

/* ----------------------- LOAD RECORDS ------------------------- */
async function loadRecordsForSelectedPatient() {
  const patientId = patientSelect.value;

  recordsTableBody.innerHTML = "";

  if (!patientId) {
    selectedPatientLabel.textContent = "No patient selected.";
    return;
  }

  selectedPatientLabel.textContent = `Selected: ${patientSelect.options[patientSelect.selectedIndex].text}`;

  try {
    const response = await fetch(`${API_BASE}/api/patients/${patientId}/records`);
    let records = await response.json();

    // Sort newest first
    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderRecordTable(records);
  } catch (err) {
    console.error(err);
    showMessage("Error loading records", true);
  }
}

/* ----------------------- RENDER RECORD TABLE ------------------ */
function renderRecordTable(records) {
  recordsTableBody.innerHTML = "";

  const today = new Date();

  records.forEach(record => {
    const tr = document.createElement("tr");

    const daysOld = (today - new Date(record.date)) / (1000 * 60 * 60 * 24);

    if (daysOld <= 7) tr.classList.add("highlight");

    tr.innerHTML = `
      <td>${record.date}</td>
      <td>${record.height || ""}</td>
      <td>${record.weightKg}</td>
      <td>${record.bmi}</td>
      <td>${record.bmr}</td>
      <td>${record.notes || ""}</td>
    `;

    recordsTableBody.appendChild(tr);
  });
}

/* ----------------------- ADD RECORD --------------------------- */
async function addRecord() {
  const patientId = patientSelect.value;
  if (!patientId) {
    showMessage("Please select a patient first.", true);
    return;
  }

  const date = recordDateInput.value;
  const height = parseFloat(recordHeightInput.value);
  const weightKg = parseFloat(recordWeightInput.value);
  const bmi = parseFloat(recordBmiInput.value);
  const bmr = parseFloat(recordBmrInput.value);
  const notes = recordNotesInput.value.trim();

  if (!date || isNaN(height) || isNaN(weightKg) || isNaN(bmi)) {
    showMessage("DOB, height, weight, and BMI are required.", true);
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/patients/${patientId}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, height, weightKg, bmi, bmr, notes })
    });

    if (!response.ok) {
      const err = await response.json();
      showMessage(err.message || "Error adding record", true);
      return;
    }

    showMessage("Record added!");

    // Reset form
    recordDateInput.value = "";
    recordHeightInput.value = "";
    recordWeightInput.value = "";
    recordBmiInput.value = "";
    bmiCategorySelect.value = "";
    recordBmrInput.value = "";
    recordNotesInput.value = "";

    loadRecordsForSelectedPatient();
  } catch (err) {
    console.error(err);
    showMessage("Error adding record", true);
  }
}

/* ----------------------- EVENT HANDLERS ------------------------ */
addPatientBtn.addEventListener("click", addPatient);
refreshPatientsBtn.addEventListener("click", loadPatients);
patientSelect.addEventListener("change", loadRecordsForSelectedPatient);

addRecordBtn.addEventListener("click", addRecord);

// Auto-BMI updates
recordWeightInput.addEventListener("input", updateBMI);
recordHeightInput.addEventListener("input", updateBMI);

/* ----------------------- INITIAL LOAD ------------------------- */
loadPatients();
