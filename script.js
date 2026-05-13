/**
 * Data Discovery & Governance Mapping - script.js
 */

const CONFIG = {
  API_BASE_URL: 'http://localhost:5001'
};

// 1. App State
const appState = {
  source: {
    name: "",
    dbType: ""
  },
  schemaRaw: "", // Store raw content from .sql file
  schema: [], // [{ table, column, datatype }]
  aiMappings: [], // [{ table, column, datatype, suggested_field_id, display_name, category, sensitivity, confidence, reasoning, status }]
  governanceMap: []
};

/// 2. Data Catalogue (Synced from Backend)
let DATA_CATALOGUE = [];

async function fetchCatalogue() {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/catalogue`);
    const data = await response.json();
    DATA_CATALOGUE = data.catalogue;
    populateRemapSelect();
  } catch (error) {
    console.error("Failed to fetch catalogue:", error);
    showToast("Error loading Data Catalogue");
  }
}


// 3. Selectors
const selectors = {
  loginScreen: document.getElementById('login-screen'),
  appContent: document.getElementById('app-content'),
  userName: document.getElementById('user-name'),
  userAvatar: document.getElementById('user-avatar'),
  logoutBtn: document.getElementById('logout-btn'),
  sourceName: document.getElementById('source-name'),
  dbType: document.getElementById('db-type'),
  saveSourceBtn: document.getElementById('save-source-btn'),
  fileInput: document.getElementById('file-input'),
  dropZone: document.getElementById('drop-zone'),
  processSchemaBtn: document.getElementById('process-schema-btn'),
  parsedTableBody: document.querySelector('#parsed-table tbody'),
  resultsTableBody: document.querySelector('#results-table tbody'),
  summaryGrid: document.getElementById('summary-grid'),
  downloadJsonBtn: document.getElementById('download-json'),
  downloadCsvBtn: document.getElementById('download-csv'),
  toastContainer: document.getElementById('toast-container'),
  remapModal: document.getElementById('remap-modal'),
  remapClose: document.getElementById('remap-close'),
  remapSelect: document.getElementById('remap-select'),
  remapConfirm: document.getElementById('remap-confirm')
};

let currentRemapIndex = null;

// 4. Initial Setup
window.onload = () => {
  initGoogleAuth();
  fetchCatalogue();

  // Check for existing session
  const savedUser = localStorage.getItem('gov_ai_user');
  if (savedUser) {
    appState.user = JSON.parse(savedUser);
    updateAuthUI(appState.user);
    showToast(`Welcome back, ${appState.user.given_name}!`);
  }
};

// Google Auth Logic
function initGoogleAuth() {
  if (!window.google || !window.google.accounts) {
    console.error("Google Identity Services not loaded.");
    return;
  }
  window.google.accounts.id.initialize({
    client_id: "67645799772-7ulh4borrg608nnb61kvf9g08utmqksr.apps.googleusercontent.com",
    callback: handleAuthResponse
  });

  window.google.accounts.id.renderButton(
    document.getElementById("google-login-btn"),
    { theme: "filled_blue", size: "large", width: 250, shape: "pill" }
  );
}

function handleAuthResponse(response) {
  const payload = decodeJwt(response.credential);
  appState.user = payload;

  // Persist session
  localStorage.setItem('gov_ai_user', JSON.stringify(payload));

  updateAuthUI(payload);
  showToast(`Welcome, ${payload.given_name}!`);
}

function updateAuthUI(user) {
  selectors.userName.innerText = user.name;
  selectors.userAvatar.src = user.picture;
  selectors.loginScreen.hidden = true;
  selectors.appContent.hidden = false;
}

function decodeJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

selectors.logoutBtn.onclick = () => {
  localStorage.removeItem('gov_ai_user');
  location.reload();
};

// 5. Functions

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  selectors.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

window.toggleSection = (wrapperId) => {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;
  const card = wrapper.closest('.card');
  card.classList.toggle('collapsed');
};

// Populate remap dropdown
function populateRemapSelect() {
  selectors.remapSelect.innerHTML = DATA_CATALOGUE.map(item =>
    `<option value="${item.field_id}">${item.display_name} (${item.category})</option>`
  ).join('');
}

// Save Source
selectors.saveSourceBtn.addEventListener('click', () => {
  appState.source.name = selectors.sourceName.value;
  appState.source.dbType = selectors.dbType.value;

  if (!appState.source.name) return showToast("Please enter a source name");
  if (!appState.source.dbType) return showToast("Please select a DB type");
  showToast("Source configuration saved!");
});

// Parse & Discover Logic (Combined)
selectors.processSchemaBtn.addEventListener('click', async () => {
  const { name, dbType } = appState.source;
  const schemaRaw = appState.schemaRaw;

  if (!name || !dbType) return showToast("Please save source info first");
  if (!schemaRaw) return showToast("Please upload a .sql file first");

  selectors.processSchemaBtn.disabled = true;
  selectors.processSchemaBtn.innerHTML = `Processing <div class="spinner"></div>`;

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/discovery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schemaRaw,
        dbType
      })
    });

    if (!response.ok) throw new Error("Processing failed");

    const data = await response.json();
    appState.schema = data.mappings.map(m => ({ table: m.table, column: m.column, datatype: m.datatype }));
    appState.aiMappings = data.mappings;

    renderParsedTable();
    renderResultsTable();
    updateSummary();
    showToast(`Discovery completed successfully!`);
  } catch (error) {
    console.error(error);
    showToast("Error processing schema via backend");
  } finally {
    selectors.processSchemaBtn.disabled = false;
    selectors.processSchemaBtn.innerText = "Process & Run Discovery";
  }
});

function renderParsedTable() {
  selectors.parsedTableBody.innerHTML = appState.schema.map(row => `
    <tr>
      <td>${row.table}</td>
      <td>${row.column}</td>
      <td><code>${row.datatype || 'N/A'}</code></td>
    </tr>
  `).join('');
}

function renderResultsTable() {
  selectors.resultsTableBody.innerHTML = appState.aiMappings.map((row, index) => `
    <tr>
      <td>${row.table}</td>
      <td>${row.column}</td>
      <td><span style="font-weight:600; color:var(--accent);">${row.display_name}</span></td>
      <td>${row.category}</td>
      <td><span class="badge" style="background: ${getSensitivityColor(row.sensitivity)}22; color: ${getSensitivityColor(row.sensitivity)}; border-color: ${getSensitivityColor(row.sensitivity)}44;">${row.sensitivity}</span></td>
      <td><span class="confidence-${getConfidenceClass(row.confidence)}">${row.confidence}%</span></td>
      <td><small style="color:var(--text-muted)">${row.reasoning}</small></td>
      <td><span class="badge badge-${row.status}">${row.status}</span></td>
      <td>
        <div class="btn-group" style="gap:4px">
          <button class="primary-btn" style="padding: 6px 10px; font-size: 11px;" onclick="updateStatus(${index}, 'approved')">Approve</button>
          <button class="secondary-btn" style="padding: 6px 10px; font-size: 11px;" onclick="openRemap(${index})">Remap</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function getSensitivityColor(s) {
  if (s === 'high' || s === 'critical') return '#ef4444';
  if (s === 'medium') return '#f59e0b';
  return '#10b981';
}

function getConfidenceClass(c) {
  if (c > 80) return 'high';
  if (c > 50) return 'medium';
  return 'low';
}

// Actions
window.updateStatus = (index, status) => {
  appState.aiMappings[index].status = status;
  renderResultsTable();
  updateSummary();
  showToast(`Row marked as ${status}`);
};

window.openRemap = (index) => {
  currentRemapIndex = index;
  selectors.remapModal.hidden = false;
};

selectors.remapClose.onclick = () => selectors.remapModal.hidden = true;

selectors.remapConfirm.onclick = () => {
  const fieldId = selectors.remapSelect.value;
  const catalogueItem = DATA_CATALOGUE.find(i => i.field_id === fieldId);

  if (currentRemapIndex !== null) {
    const row = appState.aiMappings[currentRemapIndex];
    row.suggested_field_id = catalogueItem.field_id;
    row.display_name = catalogueItem.display_name;
    row.category = catalogueItem.category;
    row.sensitivity = catalogueItem.sensitivity;
    row.status = 'remapped';
    row.reasoning = "Manually Override";
    row.confidence = 100;
  }

  selectors.remapModal.hidden = true;
  renderResultsTable();
  updateSummary();
  showToast("Column remapped successfully");
};

// Summary Logic
function updateSummary() {
  const m = appState.aiMappings;
  const stats = {
    total: m.length,
    classified: m.filter(r => r.suggested_field_id !== 'unknown').length,
    approved: m.filter(r => r.status === 'approved').length,
    rejected: m.filter(r => r.status === 'rejected').length,
    ignored: m.filter(r => r.status === 'ignored').length,
    high: m.filter(r => r.sensitivity === 'high' && r.status === 'approved').length
  };

  selectors.summaryGrid.innerHTML = `
    <div class="summary-card"><h4>Total Fields</h4><p>${stats.total}</p></div>
    <div class="summary-card"><h4>Classified</h4><p>${stats.classified}</p></div>
    <div class="summary-card"><h4>Approved</h4><p>${stats.approved}</p></div>
    <div class="summary-card"><h4>Rejected</h4><p>${stats.rejected}</p></div>
    <div class="summary-card"><h4>High Sens.</h4><p>${stats.high}</p></div>
  `;
}

// Downloads
selectors.downloadJsonBtn.onclick = () => {
  const approvedOnly = appState.aiMappings.filter(m => m.status === 'approved' || m.status === 'remapped');
  if (approvedOnly.length === 0) return showToast("No approved mappings to download");

  const blob = new Blob([JSON.stringify(approvedOnly, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'governance-map.json');
};

selectors.downloadCsvBtn.onclick = () => {
  const approvedOnly = appState.aiMappings.filter(m => m.status === 'approved' || m.status === 'remapped');
  if (approvedOnly.length === 0) return showToast("No approved mappings to download");

  let csv = "source_name,table,column,datatype,field_id,display_name,category,sensitivity,confidence,status\n";
  approvedOnly.forEach(r => {
    csv += `"${appState.source.name}","${r.table}","${r.column}","${r.datatype}","${r.suggested_field_id}","${r.display_name}","${r.category}","${r.sensitivity}",${r.confidence},"${r.status}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, 'governance-map.csv');
};

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// File Upload Logic
selectors.fileInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  readFile(file);
};

selectors.dropZone.ondragover = (e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--primary)"; };
selectors.dropZone.ondragleave = (e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--border)"; };
selectors.dropZone.ondrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) readFile(file);
};

function readFile(file) {
  if (!file.name.endsWith('.sql')) {
    return showToast("Only .sql files are allowed");
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    appState.schemaRaw = e.target.result;
    showToast(`File loaded: ${file.name}`);
  };
  reader.readAsText(file);
}
