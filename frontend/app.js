const API_BASE = 'http://localhost:3000';


const patientFullNameInput = document.getElementById('patient-fullName');
const patientAgeInput = document.getElementById('patient-age');
const patientGenderSelect = document.getElementById('patient-gender');
const patientPhoneInput = document.getElementById('patient-phone');
const patientEmailInput = document.getElementById('patient-email');
const patientActivityLevelSelect = document.getElementById('patient-activityLevel');

const addPatientBtn = document.getElementById('add-patient-btn');
const refreshPatientsBtn = document.getElementById('refresh-patients-btn');
const patientSelect = document.getElementById('patient-select');

const selectedPatientLabel = document.getElementById('selected-patient-label');
const recordHeightInput = document.getElementById('record-height');
const recordDateInput = document.getElementById('record-date');
const recordWeightInput = document.getElementById('record-weight');
const recordBmiInput = document.getElementById('record-bmi');
const recordBmrInput = document.getElementById('record-bmr');
const recordNotesInput = document.getElementById('record-notes');
const addRecordBtn = document.getElementById('add-record-btn');

const recordsTableBody = document.getElementById('records-table-body');
const messageElement = document.getElementById('message');
 
function updateBMI() {
  const weight = parseFloat(recordWeightInput.value);
  const heightCm = parseFloat(recordHeightInput.value);

  if (!isNaN(weight) && !isNaN(heightCm) && heightCm > 0) {
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    recordBmiInput.value = bmi.toFixed(1);
  }
}

function showMessage(text, isError = false) {
  messageElement.textContent = text;
  messageElement.style.color = isError ? 'red' : 'green';
  if (text) {
    setTimeout(() => {
      messageElement.textContent = '';
    }, 3000);
  }
}

async function loadPatients() {
  try {
    const response = await fetch(`${API_BASE}/api/patients`);
    const patients = await response.json();

    patientSelect.innerHTML = '<option value="">-- Select patient --</option>';

   patients.forEach(p => {
  const option = document.createElement('option');
  option.value = p.id;

  const label = p.activityLevel
    ? `${p.fullName} (ID: ${p.id}, Activity: ${p.activityLevel})`
    : `${p.fullName} (ID: ${p.id})`;

  option.textContent = label;
  patientSelect.appendChild(option);
});
 
  } catch (err) {
    console.error(err);
    showMessage('Failed to load patients', true);
  }
}

async function addPatient() {
  const fullName = patientFullNameInput.value.trim();
  const age = parseInt(patientAgeInput.value, 10);
  const gender = patientGenderSelect.value;
  const phone = patientPhoneInput.value.trim();
  const email = patientEmailInput.value.trim();
  const activityLevel = patientActivityLevelSelect.value;



  if (!fullName || !age || !gender || !phone) {
    showMessage('Full name, age, gender and phone are required.', true);
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      fullName,
      age,
      gender,
      phone,
      email,
      activityLevel   // <-- NEW FIELD SENT TO BACKEND
})

    });

    if (!response.ok) {
      const errorData = await response.json();
      showMessage(errorData.message || 'Failed to add patient', true);
      return;
    }

    const newPatient = await response.json();
    showMessage(`Added patient: ${newPatient.fullName}`);

    patientFullNameInput.value = '';
    patientAgeInput.value = '';
    patientGenderSelect.value = '';
    patientPhoneInput.value = '';
    patientEmailInput.value = '';
    patientActivityLevelSelect.value = '';

    loadPatients();
  } catch (err) {
    console.error(err);
    showMessage('Error adding patient', true);
  }
}

async function loadRecordsForSelectedPatient() {
  const patientId = parseInt(patientSelect.value, 10);

  recordsTableBody.innerHTML = '';

  if (!patientId) {
    selectedPatientLabel.textContent = 'No patient selected.';
    return;
  }

  const selectedOption = patientSelect.options[patientSelect.selectedIndex];
  selectedPatientLabel.textContent = `Selected patient: ${selectedOption.textContent}`;

  try {
    const response = await fetch(`${API_BASE}/api/patients/${patientId}/records`);
    if (!response.ok) {
      showMessage('Failed to load records', true);
      return;
    }

    const records = await response.json();
    records.forEach(record => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${record.id}</td>
        <td>${record.date}</td>
        <td>${record.weightKg}</td>
        <td>${record.bmi}</td>
        <td>${record.bmr}</td>
        <td>${record.notes || ''}</td>
        <td>
          <button class="edit-record-btn" data-id="${record.id}">Edit</button>
          <button class="delete-record-btn" data-id="${record.id}">Delete</button>
        </td>
      `;

      recordsTableBody.appendChild(tr);
    });

    attachRecordButtonHandlers();
  } catch (err) {
    console.error(err);
    showMessage('Error loading records', true);
  }
}

async function addRecord() {
  const patientId = parseInt(patientSelect.value, 10);

  if (!patientId) {
    showMessage('Please select a patient first.', true);
    return;
  }

  const date = recordDateInput.value;
  const weightKg = parseFloat(recordWeightInput.value);
  const bmi = parseFloat(recordBmiInput.value);
  const bmr = parseFloat(recordBmrInput.value);
  const notes = recordNotesInput.value.trim();

  if (!date || isNaN(weightKg) || isNaN(bmi) || isNaN(bmr)) {
    showMessage('Date, weight, BMI and BMR are required.', true);
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/patients/${patientId}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, weightKg, bmi, bmr, notes })
    });

    if (!response.ok) {
      const errorData = await response.json();
      showMessage(errorData.message || 'Failed to add record', true);
      return;
    }

    const newRecord = await response.json();
    showMessage(`Added record ID ${newRecord.id}`);

    recordDateInput.value = '';
    recordWeightInput.value = '';
    recordBmiInput.value = '';
    recordBmrInput.value = '';
    recordNotesInput.value = '';

    loadRecordsForSelectedPatient();
  } catch (err) {
    console.error(err);
    showMessage('Error adding record', true);
  }
}

function attachRecordButtonHandlers() {
  const editButtons = document.querySelectorAll('.edit-record-btn');
  const deleteButtons = document.querySelectorAll('.delete-record-btn');

  editButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const recordId = parseInt(btn.getAttribute('data-id'), 10);
      editRecord(recordId);
    });
  });

  deleteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const recordId = parseInt(btn.getAttribute('data-id'), 10);
      deleteRecord(recordId);
    });
  });
}

async function editRecord(recordId) {
  const row = Array.from(recordsTableBody.querySelectorAll('tr'))
    .find(tr => parseInt(tr.children[0].textContent, 10) === recordId);

  if (!row) {
    showMessage('Record row not found in table', true);
    return;
  }

  const currentDate = row.children[1].textContent;
  const currentWeight = row.children[2].textContent;
  const currentBmi = row.children[3].textContent;
  const currentBmr = row.children[4].textContent;
  const currentNotes = row.children[5].textContent;

  const newDate = prompt('Date (YYYY-MM-DD):', currentDate) || currentDate;
  const newWeight = parseFloat(prompt('Weight (kg):', currentWeight) || currentWeight);
  const newBmi = parseFloat(prompt('BMI:', currentBmi) || currentBmi);
  const newBmr = parseFloat(prompt('BMR:', currentBmr) || currentBmr);
  const newNotes = prompt('Notes:', currentNotes) || currentNotes;

  try {
    const response = await fetch(`${API_BASE}/api/records/${recordId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: newDate,
        weightKg: newWeight,
        bmi: newBmi,
        bmr: newBmr,
        notes: newNotes
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      showMessage(errorData.message || 'Failed to update record', true);
      return;
    }

    showMessage(`Updated record ID ${recordId}`);
    loadRecordsForSelectedPatient();
  } catch (err) {
    console.error(err);
    showMessage('Error updating record', true);
  }
}

async function deleteRecord(recordId) {
  const confirmDelete = confirm(`Are you sure you want to delete record ID ${recordId}?`);
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_BASE}/api/records/${recordId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      showMessage(errorData.message || 'Failed to delete record', true);
      return;
    }

    showMessage(`Deleted record ID ${recordId}`);
    loadRecordsForSelectedPatient();
  } catch (err) {
    console.error(err);
    showMessage('Error deleting record', true);
  }
}

addPatientBtn.addEventListener('click', addPatient);
refreshPatientsBtn.addEventListener('click', loadPatients);
patientSelect.addEventListener('change', loadRecordsForSelectedPatient);
addRecordBtn.addEventListener('click', addRecord);
recordWeightInput.addEventListener('input', updateBMI);
recordHeightInput.addEventListener('input', updateBMI);


loadPatients();
