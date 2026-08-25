/**
 * DocOPD - Doctor OPD Ticket & Digital Prescription Application
 * Full interactive logic, local persistence, WhatsApp sharing & PDF engine
 */

// Application State
const state = {
  activeTab: 'new-ticket',
  doctorProfile: {
    name: 'Dr. Arjun Mehta',
    degrees: 'MBBS, MD (Internal Medicine)',
    specialty: 'Consultant Physician & Diabetologist',
    regNumber: 'MCI-68421 / DMC',
    clinicName: 'Aarogya Medical Center & OPD Clinic',
    address: 'Suite 402, Metro Health Plaza, Ring Road, New Delhi',
    phone: '+919876543210',
    email: 'dr.arjunmehta@example.com',
    timings: 'Mon - Sat: 10:00 AM - 02:00 PM & 05:00 PM - 08:30 PM',
    fee: '500',
    currency: '₹',
    footerNotes: 'Valid for 7 days. In case of acute medical emergency, please visit the nearest hospital casualty immediately.',
    githubRepo: 'Dararsu01/DocOPD-',
    appVersion: '1.1.0'
  },
  currentTicket: {
    tokenNumber: 1,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    visitType: 'First Visit',
    patient: {
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      countryCode: '+91',
      uhid: '',
      address: ''
    },
    vitals: {
      bp: '',
      pulse: '',
      temp: '',
      weight: '',
      height: '',
      bmi: '',
      spo2: '',
      sugar: ''
    },
    symptoms: [],
    customSymptom: '',
    diagnosis: '',
    tests: [],
    customTest: '',
    testInstructions: '',
    medicines: [],
    advice: [
      'Drink 3-4 liters of boiled/filtered water daily',
      'Take light, easily digestible home-cooked meals',
      'Avoid oily, spicy and outside street food'
    ],
    customAdvice: '',
    followUp: 'After 5 days'
  },
  ticketsHistory: [],
  templates: [
    {
      id: 'viral-fever',
      name: 'Viral Fever / Flu Kit',
      desc: 'Paracetamol + Antacid + Vitamin C + Hydration advice',
      diagnosis: 'Acute Viral Pyrexia / Upper Respiratory Infection',
      symptoms: ['Fever (101°F) for 2 days', 'Body ache & Headache', 'Mild Sore Throat'],
      tests: ['Complete Blood Count (CBC)', 'Dengue NS1 Antigen (if fever > 3 days)'],
      medicines: [
        { name: 'Tab. Paracetamol 650mg (Dolo)', type: 'Tablet', dose: '1-0-1 (After Food)', duration: '3 Days', timing: 'SOS if temp > 100°F', instructions: 'Max 3 tabs in 24 hours' },
        { name: 'Tab. Pantoprazole 40mg (Pan 40)', type: 'Tablet', dose: '1-0-0 (Before Breakfast)', duration: '5 Days', timing: 'Empty Stomach', instructions: 'Take 30 mins before breakfast' },
        { name: 'Tab. Vitamin C + Zinc (Limcee)', type: 'Chewable', dose: '0-1-0 (After Lunch)', duration: '7 Days', timing: 'After Food', instructions: 'Chew slowly' }
      ],
      advice: ['Complete bed rest for 2 days', 'Tepid sponging if temperature goes above 101°F', 'Plenty of oral fluids, coconut water and soups']
    },
    {
      id: 'acute-gastro',
      name: 'Acute Gastroenteritis / Diarrhea',
      desc: 'Probiotics + ORS + Antiemetic + Antibiotic',
      diagnosis: 'Acute Gastroenteritis / Food Poisoning',
      symptoms: ['Loose stools 4-5 times', 'Abdominal cramps', 'Mild Nausea'],
      tests: ['Stool Routine & Microscopy', 'Serum Electrolytes (if severe dehydration)'],
      medicines: [
        { name: 'Tab. Ofloxacin 200mg + Ornidazole 500mg', type: 'Tablet', dose: '1-0-1 (After Food)', duration: '3 Days', timing: 'After Food', instructions: 'Complete full 3-day course' },
        { name: 'Cap. Econorm / Enterogermina (Probiotic)', type: 'Capsule', dose: '1-0-1 (After Food)', duration: '5 Days', timing: 'After Food', instructions: 'Restores healthy gut flora' },
        { name: 'Tab. Ondansetron 4mg (Emeset)', type: 'Tablet', dose: '1-0-0 (SOS)', duration: '3 Days', timing: 'Before Food', instructions: 'Take only if feeling vomiting' },
        { name: 'ORS Sachet (WHO Formula)', type: 'Powder', dose: '1 Liter in 24 Hours', duration: '3 Days', timing: 'Throughout day', instructions: 'Mix 1 sachet in 1 liter clean water' }
      ],
      advice: ['Sip ORS frequently to prevent dehydration', 'Eat boiled rice, curd (dahi), bananas and khichdi', 'Strictly avoid milk, oily foods and caffeine']
    },
    {
      id: 'hypertension-routine',
      name: 'Hypertension Routine & Workup',
      desc: 'Antihypertensive + Lipid & Kidney profile',
      diagnosis: 'Essential Stage-1 Hypertension',
      symptoms: ['Occasional morning headache', 'Exertional fatigue'],
      tests: ['Lipid Profile', 'Kidney Function Test (KFT / Serum Creatinine)', 'ECG (12 Lead)', 'Fasting Blood Sugar'],
      medicines: [
        { name: 'Tab. Telmisartan 40mg (Telma 40)', type: 'Tablet', dose: '1-0-0 (Morning)', duration: '30 Days', timing: 'After Breakfast', instructions: 'Monitor BP weekly' }
      ],
      advice: ['Low salt diet (< 3-4 grams/day)', 'Daily 30 minutes brisk walking or exercise', 'Avoid smoking, alcohol and excessive mental stress', 'Keep a daily BP log book']
    },
    {
      id: 'diabetes-screening',
      name: 'Type 2 Diabetes Initial Rx',
      desc: 'Metformin + HbA1c & Diabetic diet guidelines',
      diagnosis: 'Type 2 Diabetes Mellitus',
      symptoms: ['Increased thirst (polydipsia)', 'Increased urination (polyuria)', 'Fatigue'],
      tests: ['HbA1c (Glycated Hemoglobin)', 'Fasting & PP Blood Sugar', 'Lipid Profile', 'Urine Microalbumin'],
      medicines: [
        { name: 'Tab. Metformin 500mg SR (Glycomet 500 SR)', type: 'Tablet', dose: '0-0-1 (After Dinner)', duration: '30 Days', timing: 'With Dinner', instructions: 'Take with last bite of dinner' }
      ],
      advice: ['Strict diabetic diet: No refined sugars, sweets or sweetened beverages', 'Include green leafy vegetables, salads and high-fiber foods', 'Regular 40 min daily exercise / walking', 'Check Fasting & Post-Meal sugar once a week']
    }
  ]
};

// Common Medical Lists for Quick Add
const QUICK_SYMPTOMS = [
  'Fever', 'Dry Cough', 'Productive Cough', 'Sore Throat', 'Headache',
  'Stomach Pain', 'Nausea / Vomiting', 'Loose Motions / Diarrhea', 'Weakness & Fatigue',
  'Body Ache', 'Chest Congestion', 'Acidity & Burning', 'Cold & Runny Nose',
  'Joint Pain', 'Backache', 'Skin Itching / Rash', 'Loss of Appetite'
];

const COMMON_TESTS = [
  'Complete Blood Count (CBC)',
  'Fasting Blood Sugar (FBS)',
  'Post Prandial Blood Sugar (PPBS)',
  'HbA1c (Glycated Hemoglobin)',
  'Lipid Profile (Cholesterol, TG, HDL, LDL)',
  'Liver Function Test (LFT)',
  'Kidney Function Test (KFT / Creatinine / Urea)',
  'Thyroid Profile (T3, T4, TSH)',
  'Urine Routine & Microscopy (R/M)',
  'Serum Uric Acid',
  'Serum Electrolytes (Na+, K+, Cl-)',
  'Chest X-Ray (PA View)',
  'ECG (12 Lead)',
  'Ultrasound Abdomen & Pelvis (USG)',
  'Vitamin D3 (25-OH)',
  'Vitamin B12 Level',
  'Dengue Serology (NS1 / IgM / IgG)',
  'Widal / Typhoid Test',
  'C-Reactive Protein (CRP Quantitative)'
];

const COMMON_MEDICINES = [
  { name: 'Tab. Paracetamol 650mg (Dolo 650)', type: 'Tablet', defaultDose: '1-0-1', defaultTiming: 'After Food', defaultDuration: '3 Days', instructions: 'SOS for fever/pain' },
  { name: 'Tab. Pantoprazole 40mg (Pan 40)', type: 'Tablet', defaultDose: '1-0-0', defaultTiming: 'Empty Stomach', defaultDuration: '5 Days', instructions: '30 mins before breakfast' },
  { name: 'Tab. Amoxicillin + Clavulanic Acid 625mg (Augmentin)', type: 'Tablet', defaultDose: '1-0-1', defaultTiming: 'After Food', defaultDuration: '5 Days', instructions: 'Complete 5 full days' },
  { name: 'Tab. Azithromycin 500mg (Azee 500)', type: 'Tablet', defaultDose: '1-0-0', defaultTiming: 'After Food', defaultDuration: '3 Days', instructions: 'Take 1 hr before or 2 hrs after meal' },
  { name: 'Tab. Cetirizine 10mg (Cetzine)', type: 'Tablet', defaultDose: '0-0-1', defaultTiming: 'At Bedtime', defaultDuration: '5 Days', instructions: 'May cause mild drowsiness' },
  { name: 'Tab. Montelukast 10mg + Levocetirizine 5mg (Montair LC)', type: 'Tablet', defaultDose: '0-0-1', defaultTiming: 'At Bedtime', defaultDuration: '7 Days', instructions: 'For allergy and cough' },
  { name: 'Syr. Ascoril-D / Cough Formula (100ml)', type: 'Syrup', defaultDose: '2 Tsp (10ml) - 1-1-1', defaultTiming: 'After Food', defaultDuration: '5 Days', instructions: 'Do not drink water for 15 mins' },
  { name: 'Tab. Ondansetron 4mg (Emeset 4)', type: 'Tablet', defaultDose: '1-0-0', defaultTiming: 'Before Food', defaultDuration: '3 Days', instructions: 'SOS for nausea or vomiting' },
  { name: 'Tab. Drotaverine 80mg (Drotin DS)', type: 'Tablet', defaultDose: '1-0-1', defaultTiming: 'After Food', defaultDuration: '3 Days', instructions: 'For acute stomach cramp' },
  { name: 'Tab. Telmisartan 40mg (Telma 40)', type: 'Tablet', defaultDose: '1-0-0', defaultTiming: 'After Breakfast', defaultDuration: '30 Days', instructions: 'Daily morning with water' },
  { name: 'Tab. Metformin 500mg SR (Glycomet 500)', type: 'Tablet', defaultDose: '0-0-1', defaultTiming: 'With Food', defaultDuration: '30 Days', instructions: 'With dinner' },
  { name: 'Cap. Omeprazole 20mg (Omez 20)', type: 'Capsule', defaultDose: '1-0-0', defaultTiming: 'Empty Stomach', defaultDuration: '7 Days', instructions: 'Morning before food' }
];

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  loadStoredData();
  calculateNextToken();
  renderDoctorHeader();
  renderQuickSymptomChips();
  renderQuickTestChips();
  renderMedicineSuggestions();
  renderTemplates();
  renderTicketsHistory();
  setupEventListeners();
  updateLiveTicketPreview();
});

// Load from LocalStorage
function loadStoredData() {
  const savedDoc = localStorage.getItem('docopd_doctor_profile');
  if (savedDoc) {
    try {
      state.doctorProfile = { ...state.doctorProfile, ...JSON.parse(savedDoc) };
    } catch (e) {
      console.error('Error loading doctor profile', e);
    }
  }

  const savedTickets = localStorage.getItem('docopd_tickets_history');
  if (savedTickets) {
    try {
      state.ticketsHistory = JSON.parse(savedTickets);
    } catch (e) {
      console.error('Error loading tickets history', e);
    }
  }
}

function saveDoctorProfileToStorage() {
  localStorage.setItem('docopd_doctor_profile', JSON.stringify(state.doctorProfile));
}

function saveTicketsToStorage() {
  localStorage.setItem('docopd_tickets_history', JSON.stringify(state.ticketsHistory));
}

function calculateNextToken() {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTickets = state.ticketsHistory.filter(t => t.date === todayStr);
  state.currentTicket.tokenNumber = todayTickets.length + 1;
  const tokenEl = document.getElementById('ticketTokenNumber');
  if (tokenEl) tokenEl.value = state.currentTicket.tokenNumber;
}

// Render Doctor Header / Setup UI
function renderDoctorHeader() {
  const doc = state.doctorProfile;
  const badgeName = document.getElementById('doctorBadgeName');
  const badgeDetails = document.getElementById('doctorBadgeDetails');
  const badgeClinic = document.getElementById('doctorBadgeClinic');
  const badgeAvatar = document.getElementById('doctorBadgeAvatar');

  if (badgeName) badgeName.textContent = doc.name;
  if (badgeDetails) badgeDetails.textContent = `${doc.degrees} • Reg: ${doc.regNumber}`;
  if (badgeClinic) badgeClinic.textContent = doc.clinicName;
  if (badgeAvatar) {
    const initials = doc.name.replace('Dr.', '').trim().split(' ').map(n => n[0]).join('').substring(0, 2);
    badgeAvatar.textContent = initials || 'DR';
  }

  // Populate Setup Form Fields
  setInputValue('setupDocName', doc.name);
  setInputValue('setupDocDegrees', doc.degrees);
  setInputValue('setupDocSpecialty', doc.specialty);
  setInputValue('setupDocReg', doc.regNumber);
  setInputValue('setupClinicName', doc.clinicName);
  setInputValue('setupClinicAddress', doc.address);
  setInputValue('setupClinicPhone', doc.phone);
  setInputValue('setupClinicEmail', doc.email);
  setInputValue('setupClinicTimings', doc.timings);
  setInputValue('setupClinicFee', doc.fee);
  setInputValue('setupFooterNotes', doc.footerNotes);
  setInputValue('setupGithubRepo', doc.githubRepo);

  const versionBadge = document.getElementById('appVersionBadge');
  if (versionBadge) versionBadge.textContent = `v${doc.appVersion || '1.0.0'}`;

  const releasesLink = document.getElementById('githubReleasesLink');
  if (releasesLink && doc.githubRepo) {
    releasesLink.href = `https://github.com/${doc.githubRepo}/releases`;
  }
}

function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

// Navigation Handler
function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.view-screen').forEach(screen => {
    screen.classList.toggle('active', screen.id === `view-${tabId}`);
  });

  if (tabId === 'history') {
    renderTicketsHistory();
  } else if (tabId === 'dashboard') {
    updateDashboardStats();
  }
}

// Render Quick Chips
function renderQuickSymptomChips() {
  const container = document.getElementById('quickSymptomChips');
  if (!container) return;
  container.innerHTML = QUICK_SYMPTOMS.map(s => `
    <button type="button" class="chip-btn" onclick="toggleQuickSymptom('${s}')">${s}</button>
  `).join('');
}

function toggleQuickSymptom(symptom) {
  const idx = state.currentTicket.symptoms.indexOf(symptom);
  if (idx > -1) {
    state.currentTicket.symptoms.splice(idx, 1);
  } else {
    state.currentTicket.symptoms.push(symptom);
  }
  renderSelectedSymptoms();
  highlightSelectedSymptomChips();
  updateLiveTicketPreview();
}

function highlightSelectedSymptomChips() {
  const container = document.getElementById('quickSymptomChips');
  if (!container) return;
  container.querySelectorAll('.chip-btn').forEach(btn => {
    const sym = btn.textContent.trim();
    btn.classList.toggle('selected', state.currentTicket.symptoms.includes(sym));
  });
}

function addCustomSymptom() {
  const input = document.getElementById('customSymptomInput');
  const val = input ? input.value.trim() : '';
  if (val && !state.currentTicket.symptoms.includes(val)) {
    state.currentTicket.symptoms.push(val);
    if (input) input.value = '';
    renderSelectedSymptoms();
    highlightSelectedSymptomChips();
    updateLiveTicketPreview();
  }
}

function removeSymptom(index) {
  state.currentTicket.symptoms.splice(index, 1);
  renderSelectedSymptoms();
  highlightSelectedSymptomChips();
  updateLiveTicketPreview();
}

function renderSelectedSymptoms() {
  const container = document.getElementById('selectedSymptomsList');
  if (!container) return;
  if (state.currentTicket.symptoms.length === 0) {
    container.innerHTML = '<span style="font-size:12px; color:var(--slate-400);">No symptoms selected yet. Tap chips above or type custom.</span>';
    return;
  }
  container.innerHTML = state.currentTicket.symptoms.map((s, idx) => `
    <div class="dynamic-item-row">
      <div class="dynamic-item-info">
        <span class="dynamic-item-title">• ${s}</span>
      </div>
      <button type="button" class="btn-remove-item" onclick="removeSymptom(${idx})">✕</button>
    </div>
  `).join('');
}

// Diagnostic Tests UI
function renderQuickTestChips() {
  const container = document.getElementById('quickTestChips');
  if (!container) return;
  container.innerHTML = COMMON_TESTS.slice(0, 10).map(t => `
    <button type="button" class="chip-btn" onclick="addLabTest('${t}')">+ ${t}</button>
  `).join('');
}

function addLabTest(testName, instructions = '') {
  const exists = state.currentTicket.tests.find(t => t.name.toLowerCase() === testName.toLowerCase());
  if (!exists) {
    state.currentTicket.tests.push({ name: testName, instructions: instructions });
    renderSelectedTests();
    updateLiveTicketPreview();
  }
}

function addCustomTest() {
  const nameInput = document.getElementById('customTestNameInput');
  const instInput = document.getElementById('customTestInstInput');
  const name = nameInput ? nameInput.value.trim() : '';
  const inst = instInput ? instInput.value.trim() : '';

  if (name) {
    addLabTest(name, inst);
    if (nameInput) nameInput.value = '';
    if (instInput) instInput.value = '';
  }
}

function removeTest(index) {
  state.currentTicket.tests.splice(index, 1);
  renderSelectedTests();
  updateLiveTicketPreview();
}

function renderSelectedTests() {
  const container = document.getElementById('selectedTestsList');
  if (!container) return;
  if (state.currentTicket.tests.length === 0) {
    container.innerHTML = '<span style="font-size:12px; color:var(--slate-400);">No diagnostic tests added yet.</span>';
    return;
  }
  container.innerHTML = state.currentTicket.tests.map((t, idx) => `
    <div class="dynamic-item-row">
      <div class="dynamic-item-info">
        <span class="dynamic-item-title">🔬 ${t.name}</span>
        ${t.instructions ? `<div class="dynamic-item-subtitle">Note: ${t.instructions}</div>` : ''}
      </div>
      <button type="button" class="btn-remove-item" onclick="removeTest(${idx})">✕</button>
    </div>
  `).join('');
}

// Medicine (Rx) Management
function renderMedicineSuggestions() {
  const datalist = document.getElementById('medicineSuggestions');
  if (!datalist) return;
  datalist.innerHTML = COMMON_MEDICINES.map(m => `
    <option value="${m.name}">${m.type} • ${m.defaultDose}</option>
  `).join('');
}

function addMedicineFromForm() {
  const nameInput = document.getElementById('rxMedName');
  const typeInput = document.getElementById('rxMedType');
  const doseInput = document.getElementById('rxMedDose');
  const timingInput = document.getElementById('rxMedTiming');
  const durationInput = document.getElementById('rxMedDuration');
  const noteInput = document.getElementById('rxMedNote');

  const name = nameInput ? nameInput.value.trim() : '';
  if (!name) {
    alert('Please enter a medicine name');
    return;
  }

  const newMed = {
    name: name,
    type: typeInput ? typeInput.value : 'Tablet',
    dose: doseInput ? doseInput.value.trim() : '1-0-1',
    timing: timingInput ? timingInput.value : 'After Food',
    duration: durationInput ? durationInput.value.trim() : '5 Days',
    instructions: noteInput ? noteInput.value.trim() : ''
  };

  state.currentTicket.medicines.push(newMed);
  renderPrescribedMedicines();
  updateLiveTicketPreview();

  // Reset inputs
  if (nameInput) nameInput.value = '';
  if (noteInput) noteInput.value = '';
  if (nameInput) nameInput.focus();
}

function removeMedicine(index) {
  state.currentTicket.medicines.splice(index, 1);
  renderPrescribedMedicines();
  updateLiveTicketPreview();
}

function renderPrescribedMedicines() {
  const container = document.getElementById('prescribedMedicinesList');
  if (!container) return;
  if (state.currentTicket.medicines.length === 0) {
    container.innerHTML = '<span style="font-size:12px; color:var(--slate-400);">No medicines added to Rx. Add using the form above.</span>';
    return;
  }

  container.innerHTML = state.currentTicket.medicines.map((m, idx) => `
    <div class="rx-item-card">
      <div class="rx-item-header">
        <span class="rx-item-name-input">💊 ${idx + 1}. ${m.name} <span class="badge-clinic" style="font-size:10px;">${m.type}</span></span>
        <button type="button" class="btn-remove-item" onclick="removeMedicine(${idx})">✕</button>
      </div>
      <div class="rx-details-row">
        <div><small style="color:var(--slate-400);">Dosage:</small> <strong>${m.dose}</strong></div>
        <div><small style="color:var(--slate-400);">Timing:</small> <strong>${m.timing}</strong></div>
        <div><small style="color:var(--slate-400);">Duration:</small> <strong>${m.duration}</strong></div>
      </div>
      ${m.instructions ? `<div style="font-size:11px; color:var(--slate-600);"><small style="color:var(--slate-400);">Instructions:</small> ${m.instructions}</div>` : ''}
    </div>
  `).join('');
}

// Advice Management
function addAdviceItem() {
  const input = document.getElementById('customAdviceInput');
  const val = input ? input.value.trim() : '';
  if (val) {
    state.currentTicket.advice.push(val);
    if (input) input.value = '';
    renderAdviceList();
    updateLiveTicketPreview();
  }
}

function removeAdvice(index) {
  state.currentTicket.advice.splice(index, 1);
  renderAdviceList();
  updateLiveTicketPreview();
}

function renderAdviceList() {
  const container = document.getElementById('selectedAdviceList');
  if (!container) return;
  if (state.currentTicket.advice.length === 0) {
    container.innerHTML = '<span style="font-size:12px; color:var(--slate-400);">No advice guidelines added.</span>';
    return;
  }
  container.innerHTML = state.currentTicket.advice.map((adv, idx) => `
    <div class="dynamic-item-row">
      <div class="dynamic-item-info">
        <span class="dynamic-item-title">🌿 ${adv}</span>
      </div>
      <button type="button" class="btn-remove-item" onclick="removeAdvice(${idx})">✕</button>
    </div>
  `).join('');
}

// Calculate BMI
function calculateBMI() {
  const weight = parseFloat(document.getElementById('vitalWeight')?.value) || 0;
  const height = parseFloat(document.getElementById('vitalHeight')?.value) || 0;
  const bmiEl = document.getElementById('vitalBmi');

  if (weight > 0 && height > 0) {
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    if (bmiEl) bmiEl.value = bmi;
    state.currentTicket.vitals.bmi = bmi;
  } else {
    if (bmiEl) bmiEl.value = '';
    state.currentTicket.vitals.bmi = '';
  }
  updateLiveTicketPreview();
}

// Templates Handling
function renderTemplates() {
  const container = document.getElementById('templatesList');
  if (!container) return;
  container.innerHTML = state.templates.map(tpl => `
    <div class="template-card">
      <div>
        <div class="template-card-title">📦 ${tpl.name}</div>
        <div class="template-card-desc">${tpl.desc}</div>
        <div style="font-size:11px; color:var(--primary-dark); font-weight:600; margin-bottom:6px;">
          Includes: ${tpl.medicines.length} Medicines, ${tpl.tests.length} Tests
        </div>
      </div>
      <button type="button" class="btn btn-primary btn-sm btn-block" onclick="applyTemplate('${tpl.id}')">
        ⚡ Apply to Current Ticket
      </button>
    </div>
  `).join('');
}

function applyTemplate(templateId) {
  const tpl = state.templates.find(t => t.id === templateId);
  if (!tpl) return;

  if (tpl.diagnosis) {
    state.currentTicket.diagnosis = tpl.diagnosis;
    const diagInput = document.getElementById('ticketDiagnosis');
    if (diagInput) diagInput.value = tpl.diagnosis;
  }

  if (tpl.symptoms) {
    tpl.symptoms.forEach(s => {
      if (!state.currentTicket.symptoms.includes(s)) {
        state.currentTicket.symptoms.push(s);
      }
    });
    renderSelectedSymptoms();
    highlightSelectedSymptomChips();
  }

  if (tpl.tests) {
    tpl.tests.forEach(t => addLabTest(t));
  }

  if (tpl.medicines) {
    tpl.medicines.forEach(m => state.currentTicket.medicines.push({ ...m }));
    renderPrescribedMedicines();
  }

  if (tpl.advice) {
    tpl.advice.forEach(a => {
      if (!state.currentTicket.advice.includes(a)) {
        state.currentTicket.advice.push(a);
      }
    });
    renderAdviceList();
  }

  updateLiveTicketPreview();
  switchTab('new-ticket');
  alert(`Applied template: "${tpl.name}" to the current ticket!`);
}

// Live OPD Ticket Data Sync
function syncFormToState() {
  const t = state.currentTicket;
  t.tokenNumber = document.getElementById('ticketTokenNumber')?.value || t.tokenNumber;
  t.date = document.getElementById('ticketDate')?.value || t.date;
  t.visitType = document.getElementById('ticketVisitType')?.value || 'First Visit';

  t.patient.name = document.getElementById('patientName')?.value.trim() || '';
  t.patient.age = document.getElementById('patientAge')?.value.trim() || '';
  t.patient.gender = document.getElementById('patientGender')?.value || 'Male';
  t.patient.countryCode = document.getElementById('patientCountryCode')?.value || '+91';
  t.patient.phone = document.getElementById('patientPhone')?.value.trim() || '';
  t.patient.uhid = document.getElementById('patientUhid')?.value.trim() || '';
  t.patient.address = document.getElementById('patientAddress')?.value.trim() || '';

  t.vitals.bp = document.getElementById('vitalBp')?.value.trim() || '';
  t.vitals.pulse = document.getElementById('vitalPulse')?.value.trim() || '';
  t.vitals.temp = document.getElementById('vitalTemp')?.value.trim() || '';
  t.vitals.weight = document.getElementById('vitalWeight')?.value.trim() || '';
  t.vitals.height = document.getElementById('vitalHeight')?.value.trim() || '';
  t.vitals.bmi = document.getElementById('vitalBmi')?.value.trim() || '';
  t.vitals.spo2 = document.getElementById('vitalSpo2')?.value.trim() || '';
  t.vitals.sugar = document.getElementById('vitalSugar')?.value.trim() || '';

  t.diagnosis = document.getElementById('ticketDiagnosis')?.value.trim() || '';
  t.followUp = document.getElementById('ticketFollowUp')?.value.trim() || 'After 5 days';
}

function updateLiveTicketPreview() {
  syncFormToState();
  const t = state.currentTicket;
  const doc = state.doctorProfile;

  // Render HTML preview inside the modal container
  const slipContainer = document.getElementById('opdSlipPreviewContent');
  if (!slipContainer) return;

  const vitalsArr = [];
  if (t.vitals.bp) vitalsArr.push(`BP: <strong>${t.vitals.bp} mmHg</strong>`);
  if (t.vitals.pulse) vitalsArr.push(`Pulse: <strong>${t.vitals.pulse} bpm</strong>`);
  if (t.vitals.temp) vitalsArr.push(`Temp: <strong>${t.vitals.temp} °F</strong>`);
  if (t.vitals.spo2) vitalsArr.push(`SpO2: <strong>${t.vitals.spo2}%</strong>`);
  if (t.vitals.weight) vitalsArr.push(`Weight: <strong>${t.vitals.weight} kg</strong>`);
  if (t.vitals.height) vitalsArr.push(`Height: <strong>${t.vitals.height} cm</strong>`);
  if (t.vitals.bmi) vitalsArr.push(`BMI: <strong>${t.vitals.bmi}</strong>`);
  if (t.vitals.sugar) vitalsArr.push(`Sugar: <strong>${t.vitals.sugar} mg/dL</strong>`);

  slipContainer.innerHTML = `
    <div class="opd-slip-container" id="printableOpdSlip">
      <!-- Clinic & Doctor Header -->
      <div class="slip-header">
        <div>
          <div class="slip-clinic-name">${doc.clinicName}</div>
          <div class="slip-doc-name">${doc.name}</div>
          <div class="slip-doc-qual">${doc.degrees} • ${doc.specialty}</div>
          <div class="slip-doc-reg">Reg. No: <strong>${doc.regNumber}</strong></div>
        </div>
        <div class="slip-contact-info">
          <div>${doc.address}</div>
          <div>📞 ${doc.phone} | ✉️ ${doc.email}</div>
          <div>🕒 ${doc.timings}</div>
        </div>
      </div>

      <!-- Patient Information Strip -->
      <div class="slip-patient-banner">
        <div class="slip-patient-field">
          <div class="label">Token / OPD No</div>
          <div class="value" style="color:var(--primary-dark); font-size:14px;">#${t.tokenNumber} (${t.visitType})</div>
        </div>
        <div class="slip-patient-field">
          <div class="label">Date & Time</div>
          <div class="value">${t.date} ${t.time}</div>
        </div>
        <div class="slip-patient-field">
          <div class="label">Patient Name</div>
          <div class="value">${t.patient.name || 'Patient Name'}</div>
        </div>
        <div class="slip-patient-field">
          <div class="label">Age / Gender / Phone</div>
          <div class="value">${t.patient.age ? t.patient.age + ' Yrs' : '--'} / ${t.patient.gender} / ${t.patient.phone || '--'}</div>
        </div>
      </div>

      <!-- Vitals Strip -->
      ${vitalsArr.length > 0 ? `
        <div class="slip-vitals-bar">
          ${vitalsArr.map(v => `<span>${v}</span>`).join(' • ')}
        </div>
      ` : ''}

      <!-- Main Clinical 2-Column Body -->
      <div class="slip-columns-grid">
        <!-- Left Column: Symptoms, Diagnosis, Diagnostic Tests -->
        <div class="slip-left-col">
          ${t.symptoms.length > 0 ? `
            <div class="slip-section-box">
              <div class="slip-section-title">🩺 Chief Complaints</div>
              <ul style="padding-left:16px; margin:0;">
                ${t.symptoms.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${t.diagnosis ? `
            <div class="slip-section-box">
              <div class="slip-section-title">📋 Provisional Diagnosis</div>
              <div style="font-weight:700; color:#0f172a; background:#f1f5f9; padding:4px 8px; border-radius:4px;">
                ${t.diagnosis}
              </div>
            </div>
          ` : ''}

          ${t.tests.length > 0 ? `
            <div class="slip-section-box">
              <div class="slip-section-title">🔬 Recommended Lab / Diagnostic Tests</div>
              <ul style="padding-left:16px; margin:0;">
                ${t.tests.map(test => `
                  <li style="margin-bottom:3px;">
                    <strong>${test.name}</strong>
                    ${test.instructions ? `<br><small style="color:#64748b;">(${test.instructions})</small>` : ''}
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Right Column: Rx Medications, Advice, Follow-up -->
        <div class="slip-right-col">
          <div class="slip-rx-title">℞ Prescribed Medications</div>
          ${t.medicines.length > 0 ? `
            <table class="slip-med-table">
              <thead>
                <tr>
                  <th style="width:40%;">Medicine</th>
                  <th style="width:25%;">Dosage</th>
                  <th style="width:20%;">Timing</th>
                  <th style="width:15%;">Duration</th>
                </tr>
              </thead>
              <tbody>
                ${t.medicines.map((m, idx) => `
                  <tr>
                    <td>
                      <div class="slip-med-name">${idx + 1}. ${m.name}</div>
                      ${m.instructions ? `<div class="slip-med-instruction">${m.instructions}</div>` : ''}
                    </td>
                    <td><strong>${m.dose}</strong></td>
                    <td>${m.timing}</td>
                    <td><strong>${m.duration}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p style="color:#94a3b8; font-style:italic;">No medications prescribed yet.</p>'}

          ${t.advice.length > 0 ? `
            <div class="slip-section-box" style="margin-top:10px;">
              <div class="slip-section-title">💡 Diet & General Advice</div>
              <ul style="padding-left:16px; margin:0;">
                ${t.advice.map(a => `<li>${a}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${t.followUp ? `
            <div style="margin-top:8px; font-size:11px; background:#eff6ff; padding:5px 8px; border-radius:4px; color:#1e40af;">
              📅 <strong>Next Follow-up Visit:</strong> ${t.followUp}
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Slip Footer & Doctor Signature -->
      <div class="slip-footer">
        <div class="slip-notes">
          <div>* ${doc.footerNotes}</div>
          <div style="margin-top:2px;">Consultation Fee: <strong>${doc.currency} ${doc.fee}</strong></div>
        </div>
        <div class="slip-sign-block">
          <div style="font-weight:700; color:var(--primary-dark); font-size:12px;">${doc.name}</div>
          <div class="slip-sign-line">Doctor's Signature / Stamp</div>
        </div>
      </div>
    </div>
  `;
}

// Generate Formatted WhatsApp Text Message
function generateWhatsAppMessageText(ticket = null) {
  const t = ticket || state.currentTicket;
  const doc = state.doctorProfile;

  let msg = `🏥 *${doc.clinicName.toUpperCase()}*\n`;
  msg += `👨‍⚕️ *${doc.name}* (${doc.degrees})\n`;
  msg += `📜 Reg No: ${doc.regNumber}\n`;
  msg += `📍 ${doc.address} | 📞 ${doc.phone}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🎫 *DIGITAL OPD TICKET / PRESCRIPTION*\n`;
  msg += `*Token No:* #${t.tokenNumber} (${t.visitType})\n`;
  msg += `*Date:* ${t.date} ${t.time}\n`;
  msg += `*Patient Name:* ${t.patient.name || 'Valued Patient'}\n`;
  msg += `*Age/Gender:* ${t.patient.age ? t.patient.age + ' Yrs' : '--'} / ${t.patient.gender}\n`;
  if (t.patient.uhid) msg += `*UHID/ID:* ${t.patient.uhid}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;

  // Vitals
  const vitals = [];
  if (t.vitals.bp) vitals.push(`BP: ${t.vitals.bp}`);
  if (t.vitals.pulse) vitals.push(`Pulse: ${t.vitals.pulse} bpm`);
  if (t.vitals.temp) vitals.push(`Temp: ${t.vitals.temp}°F`);
  if (t.vitals.spo2) vitals.push(`SpO2: ${t.vitals.spo2}%`);
  if (t.vitals.weight) vitals.push(`Weight: ${t.vitals.weight}kg`);
  if (t.vitals.sugar) vitals.push(`Sugar: ${t.vitals.sugar}mg/dL`);

  if (vitals.length > 0) {
    msg += `🩺 *Vitals:* ${vitals.join(' | ')}\n\n`;
  }

  // Symptoms & Diagnosis
  if (t.symptoms && t.symptoms.length > 0) {
    msg += `📝 *Complaints / Symptoms:*\n• ${t.symptoms.join('\n• ')}\n\n`;
  }

  if (t.diagnosis) {
    msg += `📋 *Provisional Diagnosis:*\n👉 *${t.diagnosis}*\n\n`;
  }

  // Recommended Tests
  if (t.tests && t.tests.length > 0) {
    msg += `🔬 *Recommended Diagnostic Tests:*\n`;
    t.tests.forEach((test, i) => {
      msg += `${i + 1}. *${test.name}* ${test.instructions ? `(${test.instructions})` : ''}\n`;
    });
    msg += `\n`;
  }

  // Prescriptions
  if (t.medicines && t.medicines.length > 0) {
    msg += `💊 *Rx Prescribed Medications:*\n`;
    t.medicines.forEach((m, i) => {
      msg += `*${i + 1}. ${m.name}* (${m.type})\n`;
      msg += `   Dosage: ${m.dose} | ${m.timing}\n`;
      msg += `   Duration: ${m.duration} ${m.instructions ? `| Note: ${m.instructions}` : ''}\n`;
    });
    msg += `\n`;
  }

  // Advice
  if (t.advice && t.advice.length > 0) {
    msg += `💡 *Diet & General Advice:*\n• ${t.advice.join('\n• ')}\n\n`;
  }

  // Follow-up
  if (t.followUp) {
    msg += `📅 *Next Follow-up Visit:* ${t.followUp}\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `*Clinic Timings:* ${doc.timings}\n`;
  msg += `_Note: ${doc.footerNotes}_\n`;
  msg += `_Wish you a speedy and healthy recovery!_ 🙏`;

  return msg;
}

// Open WhatsApp Direct Share
function openWhatsAppShare(ticket = null) {
  syncFormToState();
  const t = ticket || state.currentTicket;

  if (!t.patient.phone) {
    const phoneInput = prompt('Please enter patient WhatsApp mobile number (with or without country code):', '9876543210');
    if (!phoneInput) return;
    t.patient.phone = phoneInput.trim();
  }

  // Clean phone number
  let rawPhone = t.patient.phone.replace(/[^0-9+]/g, '');
  if (!rawPhone.startsWith('+') && !rawPhone.startsWith('0')) {
    // prepend country code if not present
    const cc = t.patient.countryCode || '+91';
    rawPhone = cc.replace('+', '') + rawPhone;
  } else if (rawPhone.startsWith('+')) {
    rawPhone = rawPhone.replace('+', '');
  }

  const messageText = generateWhatsAppMessageText(t);
  const encodedText = encodeURIComponent(messageText);
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodedText}`;

  // Check if Native Android Interface exists
  if (window.AndroidBridge && typeof window.AndroidBridge.sendWhatsAppMessage === 'function') {
    window.AndroidBridge.sendWhatsAppMessage(rawPhone, messageText);
  } else {
    // Open in browser / WhatsApp Web / WhatsApp App
    window.open(whatsappUrl, '_blank');
  }

  // If this was an unsaved new ticket, save it to history
  if (!ticket) {
    saveCurrentTicketToHistory();
  }
}

// WhatsApp Preview Modal
function showWhatsAppPreviewModal(ticket = null) {
  syncFormToState();
  const t = ticket || state.currentTicket;
  const messageText = generateWhatsAppMessageText(t);

  const previewEl = document.getElementById('whatsappPreviewContent');
  if (previewEl) {
    previewEl.textContent = messageText;
  }

  const phoneEl = document.getElementById('whatsappModalPhone');
  if (phoneEl) {
    phoneEl.textContent = `${t.patient.countryCode || '+91'} ${t.patient.phone || 'No phone entered'}`;
  }

  openModal('whatsappPreviewModal');
}

// =========================================================
// PURE VECTOR PDF GENERATOR & ROBUST PRINT ENGINE
// =========================================================

function printOpdSlip() {
  updateLiveTicketPreview();
  const slipElement = document.getElementById('printableOpdSlip');
  if (!slipElement) {
    alert('Please open or create an OPD ticket first.');
    return;
  }

  // Check Native Android Bridge
  if (window.AndroidBridge && typeof window.AndroidBridge.printDocument === 'function') {
    window.AndroidBridge.printDocument();
    return;
  }

  // Web Browser: Dedicated hidden print iframe to isolate prescription
  let printFrame = document.getElementById('docopd_print_frame');
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'docopd_print_frame';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);
  }

  const frameDoc = printFrame.contentWindow.document;
  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>OPD_Prescription_${state.currentTicket.patient.name || 'Patient'}_Token_${state.currentTicket.tokenNumber}</title>
        <style>
          @page { size: A4 portrait; margin: 12mm 15mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; font-size: 12px; line-height: 1.4; background: #fff; }
          .opd-slip-container { width: 100%; border: none; padding: 0; box-shadow: none; }
          .slip-header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f766e; padding-bottom: 10px; margin-bottom: 12px; }
          .slip-clinic-name { font-size: 18px; font-weight: 800; color: #0f766e; text-transform: uppercase; letter-spacing: 0.5px; }
          .slip-doc-name { font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 2px; }
          .slip-doc-qual { font-size: 12px; font-weight: 600; color: #475569; }
          .slip-doc-reg { font-size: 11px; color: #64748b; }
          .slip-contact-info { text-align: right; font-size: 11px; color: #475569; line-height: 1.4; }
          .slip-patient-banner { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
          .slip-patient-field .label { font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; }
          .slip-patient-field .value { font-size: 12px; font-weight: 700; color: #0f172a; }
          .slip-vitals-bar { background: #ecfdf5; border: 1px dashed #10b981; border-radius: 6px; padding: 6px 12px; margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 10px; font-size: 11px; }
          .slip-vitals-bar span { font-weight: 600; color: #065f46; }
          .slip-columns-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 16px; margin-bottom: 16px; }
          .slip-left-col { border-right: 1px dashed #cbd5e1; padding-right: 12px; }
          .slip-section-title { font-size: 12px; font-weight: 700; color: #0f766e; text-transform: uppercase; margin-bottom: 4px; }
          .slip-section-box { margin-bottom: 12px; }
          .slip-rx-title { font-size: 18px; font-weight: 800; font-family: serif; color: #0f766e; margin-bottom: 6px; }
          .slip-med-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          .slip-med-table th { background: #f1f5f9; text-align: left; padding: 5px 6px; font-size: 10px; font-weight: 700; color: #475569; border-bottom: 1px solid #cbd5e1; }
          .slip-med-table td { padding: 6px 6px; border-bottom: 1px solid #f1f5f9; font-size: 11px; }
          .slip-med-name { font-weight: 700; color: #0f172a; }
          .slip-med-instruction { font-size: 10px; color: #64748b; }
          .slip-footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; }
          .slip-notes { font-size: 10px; color: #64748b; max-width: 60%; }
          .slip-sign-block { text-align: center; min-width: 140px; }
          .slip-sign-line { border-top: 1px solid #0f172a; margin-top: 36px; padding-top: 4px; font-size: 11px; font-weight: 700; }
        </style>
      </head>
      <body>
        ${slipElement.outerHTML}
      </body>
    </html>
  `);
  frameDoc.close();

  setTimeout(() => {
    try {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
    } catch (e) {
      window.print();
    }
  }, 250);
}

function downloadSlipAsPdf() {
  syncFormToState();
  updateLiveTicketPreview();
  const t = state.currentTicket;
  const doc = state.doctorProfile;

  // 1. If running inside Native Android App Bridge
  if (window.AndroidBridge && typeof window.AndroidBridge.generateAndSharePdf === 'function') {
    window.AndroidBridge.generateAndSharePdf(
      JSON.stringify(t),
      JSON.stringify(doc),
      t.patient.phone || null
    );
    return;
  }

  // 2. Try html2pdf if available
  const slipEl = document.getElementById('printableOpdSlip');
  if (window.html2pdf && slipEl) {
    const opt = {
      margin: 10,
      filename: `OPD_Prescription_${t.patient.name || 'Patient'}_Token_${t.tokenNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    window.html2pdf().set(opt).from(slipEl).save();
    return;
  }

  // 3. Robust Standalone Vector PDF Generator
  try {
    const pdfBlob = generateVectorPdfBlob(t, doc);
    const fileName = `OPD_Prescription_${(t.patient.name || 'Patient').replace(/\s+/g, '_')}_Token_${t.tokenNumber}.pdf`;
    
    // Trigger direct browser download
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
  } catch (err) {
    console.warn('PDF generation fallback to print:', err);
    printOpdSlip();
  }
}

/**
 * Pure JavaScript Vector PDF 1.4 Builder (Zero Dependencies, 100% Offline)
 */
function generateVectorPdfBlob(ticket, doc) {
  // A4 dimensions: 595.28 x 841.89 points
  const streamLines = [];
  
  function esc(s) {
    if (!s) return '';
    return s.toString().replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  // Background Box helper
  function drawRect(x, y, w, h, r, g, b, stroke = false, sr = 0, sg = 0, sb = 0) {
    streamLines.push(`${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} rg`);
    if (stroke) {
      streamLines.push(`${sr.toFixed(2)} ${sg.toFixed(2)} ${sb.toFixed(2)} RG`);
      streamLines.push(`1 w`);
      streamLines.push(`${x} ${y} ${w} ${h} re B`);
    } else {
      streamLines.push(`${x} ${y} ${w} ${h} re f`);
    }
  }

  function drawLine(x1, y1, x2, y2, r = 0.05, g = 0.58, b = 0.53, width = 1.5) {
    streamLines.push(`${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} RG`);
    streamLines.push(`${width} w`);
    streamLines.push(`${x1} ${y1} m ${x2} ${y2} l S`);
  }

  function drawText(txt, x, y, size = 10, font = 'F1', r = 0.1, g = 0.15, b = 0.2) {
    streamLines.push(`BT /${font} ${size} Tf ${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} rg ${x} ${y} Td (${esc(txt)}) Tj ET`);
  }

  let y = 800;

  // Header - Clinic Name & Doctor Details
  drawText(doc.clinicName.toUpperCase(), 35, y, 16, 'F2', 0.05, 0.46, 0.43);
  drawText(`Address: ${doc.address}`, 340, y, 9, 'F1', 0.3, 0.35, 0.4);
  y -= 16;
  drawText(doc.name, 35, y, 13, 'F2', 0.06, 0.09, 0.16);
  drawText(`Phone: ${doc.phone} | Email: ${doc.email}`, 340, y, 9, 'F1', 0.3, 0.35, 0.4);
  y -= 14;
  drawText(`${doc.degrees} • ${doc.specialty}`, 35, y, 10, 'F2', 0.25, 0.35, 0.4);
  drawText(`Timings: ${doc.timings}`, 340, y, 9, 'F1', 0.3, 0.35, 0.4);
  y -= 12;
  drawText(`Reg. Number: ${doc.regNumber}`, 35, y, 9, 'F1', 0.4, 0.45, 0.5);

  y -= 12;
  drawLine(35, y, 560, y, 0.05, 0.58, 0.53, 2);
  y -= 20;

  // Patient Demographic Banner Box
  drawRect(35, y - 32, 525, 42, 0.96, 0.97, 0.98, true, 0.88, 0.91, 0.94);
  drawText(`TOKEN: #${ticket.tokenNumber} (${ticket.visitType})`, 45, y - 4, 11, 'F2', 0.05, 0.46, 0.43);
  drawText(`DATE: ${ticket.date} ${ticket.time || ''}`, 45, y - 20, 9, 'F1', 0.3, 0.35, 0.4);

  const patName = ticket.patient.name || 'Valued Patient';
  const patAge = ticket.patient.age ? `${ticket.patient.age} Yrs` : '--';
  const patGender = ticket.patient.gender || 'Male';
  const patPhone = ticket.patient.phone || '--';

  drawText(`PATIENT: ${patName}`, 210, y - 4, 11, 'F2', 0.06, 0.09, 0.16);
  drawText(`AGE / GENDER: ${patAge} / ${patGender}`, 210, y - 20, 9, 'F1', 0.3, 0.35, 0.4);

  drawText(`PHONE: ${patPhone}`, 410, y - 4, 10, 'F1', 0.1, 0.15, 0.2);
  if (ticket.patient.uhid) {
    drawText(`UHID: ${ticket.patient.uhid}`, 410, y - 20, 9, 'F1', 0.3, 0.35, 0.4);
  }

  y -= 46;

  // Vitals Box
  const v = ticket.vitals || {};
  const vitalsTextArr = [];
  if (v.bp) vitalsTextArr.push(`BP: ${v.bp} mmHg`);
  if (v.pulse) vitalsTextArr.push(`Pulse: ${v.pulse} bpm`);
  if (v.temp) vitalsTextArr.push(`Temp: ${v.temp} F`);
  if (v.spo2) vitalsTextArr.push(`SpO2: ${v.spo2}%`);
  if (v.weight) vitalsTextArr.push(`Wt: ${v.weight} kg`);
  if (v.height) vitalsTextArr.push(`Ht: ${v.height} cm`);
  if (v.bmi) vitalsTextArr.push(`BMI: ${v.bmi}`);
  if (v.sugar) vitalsTextArr.push(`Sugar: ${v.sugar} mg/dL`);

  if (vitalsTextArr.length > 0) {
    drawRect(35, y - 10, 525, 20, 0.92, 0.98, 0.96, true, 0.06, 0.72, 0.5);
    drawText(`VITALS:  ${vitalsTextArr.join('   |   ')}`, 45, y - 3, 9, 'F2', 0.02, 0.37, 0.27);
    y -= 24;
  }

  y -= 10;
  const leftColX = 35;
  const rightColX = 250;
  let leftY = y;
  let rightY = y;

  // Left Column: Complaints & Symptoms
  if (ticket.symptoms && ticket.symptoms.length > 0) {
    drawText('CHIEF COMPLAINTS', leftColX, leftY, 10, 'F2', 0.05, 0.46, 0.43);
    leftY -= 14;
    ticket.symptoms.forEach(s => {
      drawText(`• ${s}`, leftColX + 5, leftY, 9, 'F1', 0.1, 0.15, 0.2);
      leftY -= 13;
    });
    leftY -= 6;
  }

  // Left Column: Provisional Diagnosis
  if (ticket.diagnosis) {
    drawText('PROVISIONAL DIAGNOSIS', leftColX, leftY, 10, 'F2', 0.05, 0.46, 0.43);
    leftY -= 14;
    drawRect(leftColX, leftY - 8, 195, 18, 0.94, 0.96, 0.98);
    drawText(ticket.diagnosis, leftColX + 5, leftY - 3, 9, 'F2', 0.06, 0.09, 0.16);
    leftY -= 24;
  }

  // Left Column: Diagnostic Tests
  if (ticket.tests && ticket.tests.length > 0) {
    drawText('RECOMMENDED LAB TESTS', leftColX, leftY, 10, 'F2', 0.05, 0.46, 0.43);
    leftY -= 14;
    ticket.tests.forEach((tst, i) => {
      drawText(`${i + 1}. ${tst.name}`, leftColX + 5, leftY, 9, 'F2', 0.1, 0.15, 0.2);
      leftY -= 12;
      if (tst.instructions) {
        drawText(`   Note: ${tst.instructions}`, leftColX + 5, leftY, 8, 'F1', 0.4, 0.45, 0.5);
        leftY -= 11;
      }
    });
    leftY -= 6;
  }

  // Right Column: Prescriptions (Rx)
  drawText('Rx  PRESCRIBED MEDICATIONS', rightColX, rightY, 13, 'F3', 0.05, 0.46, 0.43);
  rightY -= 16;

  // Rx Table Header
  drawRect(rightColX, rightY - 4, 310, 16, 0.94, 0.96, 0.98, true, 0.8, 0.83, 0.88);
  drawText('Medicine & Strength', rightColX + 5, rightY, 8, 'F2', 0.2, 0.25, 0.3);
  drawText('Dosage', rightColX + 130, rightY, 8, 'F2', 0.2, 0.25, 0.3);
  drawText('Timing', rightColX + 190, rightY, 8, 'F2', 0.2, 0.25, 0.3);
  drawText('Days', rightColX + 265, rightY, 8, 'F2', 0.2, 0.25, 0.3);
  rightY -= 16;

  if (ticket.medicines && ticket.medicines.length > 0) {
    ticket.medicines.forEach((med, i) => {
      drawText(`${i + 1}. ${med.name}`, rightColX + 5, rightY, 9, 'F2', 0.06, 0.09, 0.16);
      drawText(med.dose || '1-0-1', rightColX + 130, rightY, 9, 'F2', 0.1, 0.15, 0.2);
      drawText(med.timing || 'After Food', rightColX + 190, rightY, 8, 'F1', 0.2, 0.25, 0.3);
      drawText(med.duration || '5 Days', rightColX + 265, rightY, 8, 'F2', 0.1, 0.15, 0.2);
      rightY -= 12;

      if (med.instructions) {
        drawText(`   * ${med.instructions}`, rightColX + 12, rightY, 8, 'F1', 0.4, 0.45, 0.5);
        rightY -= 11;
      }
      rightY -= 3;
    });
  } else {
    drawText('No medications prescribed.', rightColX + 10, rightY, 9, 'F1', 0.5, 0.5, 0.5);
    rightY -= 16;
  }

  // Right Column: Diet & Advice
  if (ticket.advice && ticket.advice.length > 0) {
    rightY -= 6;
    drawText('DIET & GENERAL ADVICE', rightColX, rightY, 10, 'F2', 0.05, 0.46, 0.43);
    rightY -= 14;
    ticket.advice.forEach(a => {
      drawText(`• ${a}`, rightColX + 5, rightY, 8, 'F1', 0.1, 0.15, 0.2);
      rightY -= 11;
    });
  }

  // Right Column: Follow-up
  if (ticket.followUp) {
    rightY -= 8;
    drawRect(rightColX, rightY - 6, 310, 18, 0.93, 0.96, 1.0, true, 0.74, 0.82, 0.98);
    drawText(`NEXT FOLLOW-UP VISIT:  ${ticket.followUp}`, rightColX + 8, rightY - 1, 9, 'F2', 0.12, 0.25, 0.68);
    rightY -= 20;
  }

  // Vertical Separator between columns
  const lowestY = Math.min(leftY, rightY, 200);
  drawLine(235, y + 4, 235, lowestY, 0.8, 0.83, 0.88, 1);

  // Footer Section
  const footY = 100;
  drawLine(35, footY + 16, 560, footY + 16, 0.8, 0.83, 0.88, 1);
  drawText(`* ${doc.footerNotes}`, 35, footY + 2, 8, 'F1', 0.4, 0.45, 0.5);
  drawText(`Consultation Fee: ${doc.currency} ${doc.fee}`, 35, footY - 10, 9, 'F2', 0.2, 0.25, 0.3);
  drawText(`Software by: ARSALAN YOUSUF DAR (dararsu01@gmail.com)`, 35, footY - 22, 7, 'F1', 0.5, 0.55, 0.6);

  // Signature Block
  drawText(doc.name, 430, footY + 2, 10, 'F2', 0.05, 0.46, 0.43);
  drawLine(410, footY - 8, 550, footY - 8, 0.1, 0.15, 0.2, 1);
  drawText(`Doctor's Signature / Stamp`, 425, footY - 18, 8, 'F1', 0.3, 0.35, 0.4);

  // Assemble PDF Object Stream
  const streamContent = streamLines.join('\n');
  const streamLen = streamContent.length;

  const pdfObjects = [
    `%PDF-1.4\n%âãÏÓ`,
    // Obj 1: Catalog
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`,
    // Obj 2: Pages
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`,
    // Obj 3: Page
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>\nendobj`,
    // Obj 4: Font Helvetica
    `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`,
    // Obj 5: Font Helvetica-Bold
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj`,
    // Obj 6: Font Times-Bold
    `6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>\nendobj`,
    // Obj 7: Content Stream
    `7 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream\nendobj`
  ];

  // Calculate offsets for xref table
  let currentOffset = 0;
  const offsets = [];
  let pdfBody = '';

  for (let i = 0; i < pdfObjects.length; i++) {
    offsets.push(currentOffset);
    const chunk = pdfObjects[i] + '\n';
    pdfBody += chunk;
    currentOffset += chunk.length;
  }

  const xrefOffset = currentOffset;
  let xref = `xref\n0 8\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    const offStr = offsets[i].toString().padStart(10, '0');
    xref += `${offStr} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size 8 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  const completePdf = pdfBody + xref + trailer;

  return new Blob([completePdf], { type: 'application/pdf' });
}

// Save & Issue Ticket
function issueAndSaveTicket() {
  syncFormToState();
  const t = state.currentTicket;

  if (!t.patient.name) {
    alert('Please enter Patient Name before issuing OPD ticket.');
    document.getElementById('patientName')?.focus();
    return;
  }

  saveCurrentTicketToHistory();
  openModal('slipPreviewModal');
}

function saveCurrentTicketToHistory() {
  const newRecord = JSON.parse(JSON.stringify(state.currentTicket));
  newRecord.id = 'TKT_' + Date.now();
  newRecord.createdAt = new Date().toISOString();

  // Add to start of history
  state.ticketsHistory.unshift(newRecord);
  saveTicketsToStorage();
  updateDashboardStats();
}

// Reset Ticket Form for Next Patient
function resetTicketForm() {
  const todayStr = new Date().toISOString().split('T')[0];
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  state.currentTicket = {
    tokenNumber: 1,
    date: todayStr,
    time: timeStr,
    visitType: 'First Visit',
    patient: {
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      countryCode: '+91',
      uhid: '',
      address: ''
    },
    vitals: {
      bp: '',
      pulse: '',
      temp: '',
      weight: '',
      height: '',
      bmi: '',
      spo2: '',
      sugar: ''
    },
    symptoms: [],
    customSymptom: '',
    diagnosis: '',
    tests: [],
    customTest: '',
    testInstructions: '',
    medicines: [],
    advice: [
      'Drink 3-4 liters of boiled/filtered water daily',
      'Take light, easily digestible home-cooked meals',
      'Avoid oily, spicy and outside street food'
    ],
    customAdvice: '',
    followUp: 'After 5 days'
  };

  calculateNextToken();

  // Reset form elements
  setInputValue('patientName', '');
  setInputValue('patientAge', '');
  setInputValue('patientPhone', '');
  setInputValue('patientUhid', '');
  setInputValue('patientAddress', '');
  setInputValue('vitalBp', '');
  setInputValue('vitalPulse', '');
  setInputValue('vitalTemp', '');
  setInputValue('vitalWeight', '');
  setInputValue('vitalHeight', '');
  setInputValue('vitalBmi', '');
  setInputValue('vitalSpo2', '');
  setInputValue('vitalSugar', '');
  setInputValue('ticketDiagnosis', '');
  setInputValue('ticketFollowUp', 'After 5 days');

  renderSelectedSymptoms();
  highlightSelectedSymptomChips();
  renderSelectedTests();
  renderPrescribedMedicines();
  renderAdviceList();
  updateLiveTicketPreview();
}

// Tickets History UI & Search
function renderTicketsHistory(searchQuery = '') {
  const container = document.getElementById('ticketsHistoryList');
  if (!container) return;

  let list = state.ticketsHistory;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(t => 
      t.patient.name.toLowerCase().includes(q) ||
      (t.patient.phone && t.patient.phone.includes(q)) ||
      (t.diagnosis && t.diagnosis.toLowerCase().includes(q)) ||
      t.tokenNumber.toString() === q
    );
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:30px; color:var(--slate-400);">
        <div style="font-size:32px; margin-bottom:8px;">📋</div>
        <p>No OPD tickets found.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(t => `
    <div class="ticket-list-item">
      <div class="ticket-item-top">
        <span class="ticket-token-badge">Token #${t.tokenNumber}</span>
        <span class="ticket-item-date">📅 ${t.date} ${t.time || ''}</span>
      </div>
      <div class="ticket-patient-name">${t.patient.name}</div>
      <div class="ticket-patient-meta">
        <span>👤 ${t.patient.age ? t.patient.age + ' Yrs' : '--'}, ${t.patient.gender}</span>
        <span>📞 ${t.patient.phone || 'No phone'}</span>
        ${t.diagnosis ? `<span>🩺 <strong>${t.diagnosis}</strong></span>` : ''}
      </div>
      <div style="font-size:11px; color:var(--slate-600);">
        💊 ${t.medicines.length} Medicines | 🔬 ${t.tests.length} Tests
      </div>
      <div class="ticket-item-actions">
        <button type="button" class="btn btn-secondary btn-sm" onclick="viewHistoryTicket('${t.id}')">
          👁️ View Slip
        </button>
        <button type="button" class="btn btn-whatsapp btn-sm" onclick="shareHistoryTicketWhatsApp('${t.id}')">
          📱 Send WhatsApp
        </button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="duplicateTicket('${t.id}')">
          🔁 Duplicate
        </button>
        <button type="button" class="btn btn-secondary btn-sm" style="color:var(--danger);" onclick="deleteTicket('${t.id}')">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

function viewHistoryTicket(id) {
  const t = state.ticketsHistory.find(item => item.id === id);
  if (!t) return;
  state.currentTicket = JSON.parse(JSON.stringify(t));
  updateLiveTicketPreview();
  openModal('slipPreviewModal');
}

function shareHistoryTicketWhatsApp(id) {
  const t = state.ticketsHistory.find(item => item.id === id);
  if (!t) return;
  openWhatsAppShare(t);
}

function duplicateTicket(id) {
  const t = state.ticketsHistory.find(item => item.id === id);
  if (!t) return;
  state.currentTicket = JSON.parse(JSON.stringify(t));
  state.currentTicket.date = new Date().toISOString().split('T')[0];
  state.currentTicket.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  calculateNextToken();

  // Populate inputs
  setInputValue('patientName', state.currentTicket.patient.name);
  setInputValue('patientAge', state.currentTicket.patient.age);
  setInputValue('patientGender', state.currentTicket.patient.gender);
  setInputValue('patientPhone', state.currentTicket.patient.phone);
  setInputValue('patientUhid', state.currentTicket.patient.uhid);
  setInputValue('patientAddress', state.currentTicket.patient.address);
  setInputValue('ticketDiagnosis', state.currentTicket.diagnosis);

  renderSelectedSymptoms();
  highlightSelectedSymptomChips();
  renderSelectedTests();
  renderPrescribedMedicines();
  renderAdviceList();
  updateLiveTicketPreview();
  switchTab('new-ticket');
}

function deleteTicket(id) {
  if (confirm('Are you sure you want to delete this OPD record?')) {
    state.ticketsHistory = state.ticketsHistory.filter(t => t.id !== id);
    saveTicketsToStorage();
    renderTicketsHistory();
    updateDashboardStats();
  }
}

// Dashboard Summary Stats
function updateDashboardStats() {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTickets = state.ticketsHistory.filter(t => t.date === todayStr);

  const totalEl = document.getElementById('statTotalTickets');
  const todayEl = document.getElementById('statTodayTickets');
  const revenueEl = document.getElementById('statTodayRevenue');

  if (totalEl) totalEl.textContent = state.ticketsHistory.length;
  if (todayEl) todayEl.textContent = todayTickets.length;
  if (revenueEl) {
    const fee = parseFloat(state.doctorProfile.fee) || 0;
    revenueEl.textContent = `${state.doctorProfile.currency}${todayTickets.length * fee}`;
  }
}

// Doctor Setup Save
function saveDoctorSettings() {
  state.doctorProfile.name = document.getElementById('setupDocName')?.value.trim() || state.doctorProfile.name;
  state.doctorProfile.degrees = document.getElementById('setupDocDegrees')?.value.trim() || state.doctorProfile.degrees;
  state.doctorProfile.specialty = document.getElementById('setupDocSpecialty')?.value.trim() || state.doctorProfile.specialty;
  state.doctorProfile.regNumber = document.getElementById('setupDocReg')?.value.trim() || state.doctorProfile.regNumber;
  state.doctorProfile.clinicName = document.getElementById('setupClinicName')?.value.trim() || state.doctorProfile.clinicName;
  state.doctorProfile.address = document.getElementById('setupClinicAddress')?.value.trim() || state.doctorProfile.address;
  state.doctorProfile.phone = document.getElementById('setupClinicPhone')?.value.trim() || state.doctorProfile.phone;
  state.doctorProfile.email = document.getElementById('setupClinicEmail')?.value.trim() || state.doctorProfile.email;
  state.doctorProfile.timings = document.getElementById('setupClinicTimings')?.value.trim() || state.doctorProfile.timings;
  state.doctorProfile.fee = document.getElementById('setupClinicFee')?.value.trim() || state.doctorProfile.fee;
  state.doctorProfile.footerNotes = document.getElementById('setupFooterNotes')?.value.trim() || state.doctorProfile.footerNotes;
  state.doctorProfile.githubRepo = document.getElementById('setupGithubRepo')?.value.trim() || state.doctorProfile.githubRepo;

  saveDoctorProfileToStorage();
  renderDoctorHeader();
  updateLiveTicketPreview();
  alert('Doctor profile & clinic details saved successfully!');
  switchTab('new-ticket');
}

// GitHub Releases & In-App Update Checker
async function checkForAppUpdates() {
  const repo = document.getElementById('setupGithubRepo')?.value.trim() || state.doctorProfile.githubRepo;
  const resultEl = document.getElementById('updateCheckResult');

  if (!repo || !repo.includes('/')) {
    if (resultEl) resultEl.innerHTML = '<span style="color:var(--danger);">⚠️ Please specify your GitHub repo as <code>username/repository</code> (e.g. <code>DrSharma/DocOPD</code>).</span>';
    return;
  }

  if (resultEl) resultEl.innerHTML = '<span style="color:var(--secondary);">⏳ Checking GitHub for latest releases...</span>';

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
    if (!response.ok) {
      if (response.status === 404) {
        if (resultEl) resultEl.innerHTML = `<span style="color:var(--slate-600);">No releases published yet on <strong>${repo}</strong>. Once you publish a release, updates will appear here!</span>`;
      } else {
        if (resultEl) resultEl.innerHTML = `<span style="color:var(--danger);">Error checking updates: HTTP ${response.status}</span>`;
      }
      return;
    }

    const data = await response.json();
    const latestVersion = (data.tag_name || '').replace('v', '').trim();
    const currentVer = state.doctorProfile.appVersion || '1.0.0';

    const apkAsset = data.assets && data.assets.find(a => a.name.endsWith('.apk'));
    const downloadUrl = apkAsset ? apkAsset.browser_download_url : data.html_url;

    if (latestVersion && latestVersion !== currentVer) {
      if (resultEl) {
        resultEl.innerHTML = `
          <div style="background:var(--accent-light); padding:10px; border-radius:8px; border:1px solid var(--accent); margin-top:8px;">
            <div style="font-weight:700; color:#065f46;">🎉 New Update Available: v${latestVersion}</div>
            <div style="font-size:11px; color:#047857; margin:4px 0;">${data.name || 'New release with latest features and improvements'}</div>
            <a href="${downloadUrl}" target="_blank" class="btn btn-whatsapp btn-sm" style="display:inline-block; margin-top:4px; text-decoration:none;">
              📥 Download Latest APK (v${latestVersion})
            </a>
          </div>
        `;
      }
    } else {
      if (resultEl) {
        resultEl.innerHTML = `<span style="color:var(--accent); font-weight:600;">✅ You are using the latest version (v${currentVer})!</span>`;
      }
    }
  } catch (err) {
    if (resultEl) {
      resultEl.innerHTML = `
        <span style="color:var(--slate-600);">
          Checked repo <strong>${repo}</strong>. Visit <a href="https://github.com/${repo}/releases" target="_blank" style="color:var(--primary);">GitHub Releases</a> to view available APK downloads.
        </span>
      `;
    }
  }
}

// Modal Helpers
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('active');
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('active');
}

// Setup Event Listeners
function setupEventListeners() {
  // Live form sync
  const inputsToTrack = [
    'patientName', 'patientAge', 'patientGender', 'patientPhone', 'patientUhid',
    'vitalBp', 'vitalPulse', 'vitalTemp', 'vitalSpo2', 'vitalSugar',
    'ticketDiagnosis', 'ticketFollowUp'
  ];
  inputsToTrack.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateLiveTicketPreview);
  });

  // Search History
  const searchInput = document.getElementById('historySearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderTicketsHistory(e.target.value);
    });
  }

  // Close modals when clicking overlay
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
}
