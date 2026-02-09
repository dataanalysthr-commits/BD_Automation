// =======================
// AUTH PROTECTION
// =======================
const token = localStorage.getItem("facility_auth");
const allowedPage = localStorage.getItem("facility_allowed_page");

if (!token || allowedPage !== "dashboard") {
  window.location.href = "login.html";
}

// =======================
// LOGOUT
// =======================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("facility_auth");
    localStorage.removeItem("facility_auth_user");
    window.location.href = "login.html";
  });
}

// =======================
// CONSTANTS
// =======================
const employeeTbody = document.getElementById("employeeTbody");
const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadReportBtn = document.getElementById("downloadReportBtn");
const statusMsg = document.getElementById("statusMsg");
const employeeFile = document.getElementById("employeeFile");

const API_BASE = "http://localhost:5000";

// =======================
// HELPERS
// =======================
function setStatus(msg) {
  if (statusMsg) statusMsg.textContent = msg;
}

/**
 * Strong number parser:
 * - Handles "12,000" / "₹ 12,000.50" / " 12000 " / actual numbers from Excel
 * - Returns 0 for blanks/invalid
 */
function n(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number" && Number.isFinite(val)) return val;

  const cleaned = String(val)
    .trim()
    .replace(/,/g, "")         // 12,000 -> 12000
    .replace(/[^\d.-]/g, "");  // remove ₹ $ spaces etc.

  if (!cleaned) return 0;
  const x = Number(cleaned);
  return Number.isFinite(x) ? x : 0;
}

/**
 * Normalize header so:
 * "Salary (As per Invoice)" -> "salaryasperinvoice"
 * "Service Provided" -> "serviceprovided"
 * "Employee_Name" -> "employeename"
 */
function normalizeHeader(h) {
  return String(h ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ""); // remove all non-alphanumeric
}

// =======================
// EMPLOYEE ROW LOGIC
// =======================
function createEmployeeRow(data = {}) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><input class="mini-input" type="text" placeholder="e.g., Supervisor" value="${data.designation ?? ""}"></td>
    <td><input class="mini-input" type="text" placeholder="e.g., Housekeeping" value="${data.serviceProvided ?? ""}"></td>
    <td><input class="mini-input" type="text" placeholder="e.g., Amit Kumar" value="${data.employeeName ?? ""}"></td>

    <td class="right">
      <input class="mini-input" type="number" min="0" step="0.01" placeholder="0.00"
        value="${data.salaryInvoice ?? ""}">
    </td>

    <td class="right">
      <input class="mini-input" type="number" min="0" step="0.01" placeholder="0.00"
        value="${data.salaryActual ?? ""}">
    </td>

    <td class="right"><button class="btn" type="button">Remove</button></td>
  `;

  tr.querySelector("button").addEventListener("click", () => tr.remove());
  return tr;
}

function addEmployeeRow(prefill = {}) {
  employeeTbody.appendChild(createEmployeeRow(prefill));
}

// Default row
addEmployeeRow();

if (addEmployeeBtn) {
  addEmployeeBtn.addEventListener("click", () => addEmployeeRow());
}

function getEmployees() {
  const rows = Array.from(employeeTbody.querySelectorAll("tr"));
  return rows.map((tr) => {
    const inputs = tr.querySelectorAll("input");
    return {
      designation: inputs[0].value.trim(),
      serviceProvided: inputs[1].value.trim(),
      employeeName: inputs[2].value.trim(),
      salaryInvoice: n(inputs[3].value),
      salaryActual: n(inputs[4].value),
    };
  });
}

// =======================
// FILE UPLOAD (CSV / XLSX)
// =======================

// Header aliases (normalized)
const HEADER_ALIASES = {
  designation: [
    "designation", "role", "post", "title"
  ],
  serviceProvided: [
    "serviceprovided", "service", "department", "work", "servicename"
  ],
  employeeName: [
    "employeename", "name", "employee", "staffname", "employeefullname"
  ],
  salaryInvoice: [
    "salaryasperinvoice", "salaryinvoice", "invoice", "invoiceamount",
    "salaryinvoiceamount", "salaryinvoicevalue"
  ],
  salaryActual: [
    "salaryasperactual", "salaryactual", "actual", "actualamount",
    "salaryactualamount", "salaryactualvalue"
  ],
};

function getCell(row, idx) {
  return row && idx >= 0 ? row[idx] : "";
}

function findHeaderIndex(headers, wantedKey) {
  const normalizedHeaders = headers.map(normalizeHeader);
  const aliases = HEADER_ALIASES[wantedKey].map(normalizeHeader);

  for (let i = 0; i < normalizedHeaders.length; i++) {
    if (aliases.includes(normalizedHeaders[i])) return i;
  }
  return -1;
}

// Basic CSV line splitter (handles quotes)
function splitCSVLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"' && line[i + 1] === '"') {
      cur += '"';
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function parseCSV(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) throw new Error("CSV has no data rows.");

  const headers = splitCSVLine(lines[0]);
  const rows = lines.slice(1).map(line => splitCSVLine(line));
  return { headers, rows };
}

function loadEmployeesFromTableRows(headers, rows) {
  const idxDesignation = findHeaderIndex(headers, "designation");
  const idxService = findHeaderIndex(headers, "serviceProvided");
  const idxName = findHeaderIndex(headers, "employeeName");
  const idxInv = findHeaderIndex(headers, "salaryInvoice");
  const idxActual = findHeaderIndex(headers, "salaryActual");

  // If salary columns are missing, do NOT force them to exist;
  // We will still load other columns, salary becomes 0 if missing.
  if (idxDesignation === -1 && idxService === -1 && idxName === -1) {
    throw new Error(
      "Could not detect required columns. Expected headers like: Designation, Service Provided, Employee Name, Salary (As per Invoice), Salary (As per Actual)."
    );
  }

  const employees = rows
    .map((r) => {
      const designation = String(getCell(r, idxDesignation)).trim();
      const serviceProvided = String(getCell(r, idxService)).trim();
      const employeeName = String(getCell(r, idxName)).trim();

      const salaryInvoice = n(getCell(r, idxInv));
      const salaryActual = n(getCell(r, idxActual));

      const allEmpty =
        !designation && !serviceProvided && !employeeName &&
        salaryInvoice === 0 && salaryActual === 0;

      if (allEmpty) return null;

      return { designation, serviceProvided, employeeName, salaryInvoice, salaryActual };
    })
    .filter(Boolean);

  return employees;
}

async function handleEmployeeFile(file) {
  if (!file) return;

  const name = file.name.toLowerCase();
  setStatus("Reading file...");

  try {
    let employees = [];

    if (name.endsWith(".csv")) {
      const text = await file.text();
      const { headers, rows } = parseCSV(text);
      employees = loadEmployeesFromTableRows(headers, rows);
    } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheetName = wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];

      // IMPORTANT: raw: true so numeric cells come as numbers
      const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true });
      if (!aoa || aoa.length < 2) throw new Error("Excel sheet has no data rows.");

      const headers = aoa[0];
      const rows = aoa.slice(1);
      employees = loadEmployeesFromTableRows(headers, rows);
    } else {
      throw new Error("Unsupported file type. Please upload .csv, .xlsx, or .xls.");
    }

    employeeTbody.innerHTML = "";

    if (employees.length === 0) {
      addEmployeeRow();
      setStatus("No employee data found in file. Added an empty row.");
      return;
    }

    employees.forEach(emp => addEmployeeRow(emp));
    setStatus(`Loaded ${employees.length} employee(s) from file.`);
  } catch (err) {
    console.error(err);
    setStatus(`File load failed: ${err.message}`);
  } finally {
    // allow selecting same file again
    if (employeeFile) employeeFile.value = "";
  }
}

if (employeeFile) {
  employeeFile.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    handleEmployeeFile(file);
  });
}

// =======================
// BUILD PAYLOADS
// =======================
function buildSiteEmployeesPayload() {
  return {
    siteDetails: {
      siteName: document.getElementById("siteName").value.trim(),
      invoiceNo: document.getElementById("invoiceNumber").value.trim(),
      managerId: document.getElementById("managerId")?.value?.trim() || "",
      reportingManager: document.getElementById("reportingManager").value.trim(),
      updateDate: document.getElementById("updateDate").value,
      billingMonth: document.getElementById("billingMonth").value
    },
    employees: getEmployees().map(e => ({
      designation: e.designation,
      serviceProvided: e.serviceProvided,
      employeeName: e.employeeName,
      salaryInvoice: e.salaryInvoice,
      salaryActual: e.salaryActual
    }))
  };
}

function buildClientChargesPayload() {
  return {
    invoiceNo: document.getElementById("invoiceNumber").value.trim(),
    siteName: document.getElementById("siteName").value.trim(),
    managerId: document.getElementById("managerId").value.trim(),
    reportingManager: document.getElementById("reportingManager").value.trim(),
    updateDate: document.getElementById("updateDate").value,
    billingMonth: document.getElementById("billingMonth").value,

    serviceFeePercent: Number(document.getElementById("serviceFeePercent").value || 0),
    serviceFeeInvoiceAmount: Number(document.getElementById("serviceFeeInvoice").value || 0),
    serviceFeeActualAmount: Number(document.getElementById("serviceFeeActual").value || 0),
    serviceFeeDate: document.getElementById("serviceFeeDate")?.value || null,

    materialCostPercent: Number(document.getElementById("materialCostPercent").value || 0),
    materialCostInvoiceAmount: Number(document.getElementById("materialCostInvoice").value || 0),
    materialCostActualAmount: Number(document.getElementById("materialCostActual").value || 0),
    materialCostDate: document.getElementById("materialCostDate")?.value || null
  };
}

// =======================
// BACKEND API CALLS
// =======================
async function saveSiteEmployees(payload) {
  const res = await fetch(`${API_BASE}/api/dashboard/site-employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to save site employees");
  }

  return res.json();
}

async function saveClientCharges(payload) {
  const res = await fetch(`${API_BASE}/api/dashboard/client-charges`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to save client charges");
  }

  return res.json();
}

// =======================
// SAVE BUTTON (DOWNLOAD REPORT BUTTON)
// =======================
if (downloadReportBtn) {
  downloadReportBtn.addEventListener("click", async () => {
    setStatus("");

    // ✅ VALIDATION (prevents MySQL date error)
    const siteName = document.getElementById("siteName").value.trim();
    const invoiceNo = document.getElementById("invoiceNumber").value.trim();
    const managerId = document.getElementById("managerId").value.trim();
    const reportingManager = document.getElementById("reportingManager").value.trim();
    const updateDate = document.getElementById("updateDate").value;     // yyyy-mm-dd
    const billingMonth = document.getElementById("billingMonth").value; // yyyy-mm

    if (!siteName) return setStatus(" Please enter Site Name.");
    if (!invoiceNo) return setStatus(" Please enter Invoice Number.");
    if (!managerId) return setStatus(" Please enter Manager ID.");
    if (!reportingManager) return setStatus(" Please enter Reporting Manager.");
    if (!updateDate) return setStatus(" Please select Update Date.");
    if (!billingMonth) return setStatus("Please select Billing Month.");

    // Optional: ensure at least 1 employee row has a name/designation
    const employees = getEmployees().filter(e =>
      e.employeeName || e.designation || e.serviceProvided || e.salaryInvoice || e.salaryActual
    );
    if (employees.length === 0) return setStatus("Please add at least 1 employee row.");

    try {
      setStatus("Saving Site & Employees...");
      const sitePayload = buildSiteEmployeesPayload();
      await saveSiteEmployees(sitePayload);

      setStatus("Saving Client Charges...");
      const chargesPayload = buildClientChargesPayload();
      await saveClientCharges(chargesPayload);

      setStatus("✅ All data saved successfully.");
    } catch (e) {
      console.error(e);
      setStatus(`Save failed: ${e.message}`);
    }
  });
}

// =======================
// CLEAR BUTTON
// =======================
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    document.getElementById("siteName").value = "";
    document.getElementById("reportingManager").value = "";
    document.getElementById("invoiceNumber").value = "";
    document.getElementById("managerId").value = "";
    document.getElementById("updateDate").value = "";
    document.getElementById("billingMonth").value = "";

    document.getElementById("serviceFeePercent").value = "";
    document.getElementById("materialCostPercent").value = "";

    employeeTbody.innerHTML = "";
    addEmployeeRow();

    document.getElementById("serviceFeeInvoice").value = "";
    document.getElementById("serviceFeeActual").value = "";
    document.getElementById("materialCostInvoice").value = "";
    document.getElementById("materialCostActual").value = "";

    const sInvNo = document.getElementById("serviceFeeInvNo");
    const mInvNo = document.getElementById("materialCostInvNo");
    if (sInvNo) sInvNo.value = "";
    if (mInvNo) mInvNo.value = "";

    setStatus("Form cleared.");
  });
}

