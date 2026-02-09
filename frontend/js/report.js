function applyOnEnter(containerSelector, applyFunction) {
  const container = document.querySelector(containerSelector);

  if (!container) return;

  container.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // stop form submit / reload
      applyFunction();
    }
  });
}
// Enter key support
applyOnEnter("#pnlFilters", loadReport);
applyOnEnter("#ledgerFilters", loadLedger);
applyOnEnter("#commissionLedgerFilters", loadCommissionLedger);


// =======================
// AUTH PROTECTION
// =======================
const token = localStorage.getItem("facility_auth");
const allowedPage = localStorage.getItem("facility_allowed_page");

if (!token || allowedPage !== "report") {
  window.location.href = "login.html";
}

// =======================
// CONSTANTS
// =======================
const API_BASE = "http://localhost:5000";
const tbody = document.getElementById("reportTbody");
const applyBtn = document.getElementById("applyFilter");
const logoutBtn = document.getElementById("logoutBtn");

// =======================
// LOGOUT
// =======================
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
}

// =======================
// LOAD REPORT
// =======================
applyBtn.addEventListener("click", loadReport);

async function loadReport() {
  const site = document.getElementById("siteFilter").value.trim();
  const month = document.getElementById("monthFilter").value;
  const manager = document.getElementById("managerFilter").value.trim();

  const params = new URLSearchParams();
  if (site) params.append("site_name", site);
  if (month) params.append("month", month);
  if (manager) params.append("manager_id", manager);

  try {
    const res = await fetch(
      `${API_BASE}/api/reports/financial-summary?${params.toString()}`,
      {
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );

    // 🔐 Token expired / invalid
    if (res.status === 401 || res.status === 403) {
      alert("Session expired. Please login again.");
      localStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) {
      throw new Error("Failed to load report data");
    }

    const data = await res.json();
    renderTable(data);

  } catch (err) {
    console.error(err);
    alert("Unable to fetch report data");
  }
}

// =======================
// RENDER TABLE
// =======================
function renderTable(rows) {
  tbody.innerHTML = "";

  if (!rows.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center;">No data found</td>
      </tr>
    `;
    return;
  }

  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
  <td>${r.site_name}</td>
  <td>${r.month}</td>
  <td>${r.manager_id}</td>

  <td>${r.salary_invoice_total}</td>
  <td>${r.salary_actual_total}</td>

  <td>${r.total_service_fee_per_actual}</td>
  <td>${r.total_material_cost_per_invoice}</td>
  <td>${r.total_material_cost_per_actual}</td>

  <td>${r.total_commission_invoice}</td>
  <td>${r.total_commission_actual}</td>

  <td>${r.total_to_client}</td>
  <td>${r.total_actual_exp_against_invoice_to_client}</td>

  <td>${r.salary}</td>
  <td>${r.conveyance}</td>
  <td>${r.impressed}</td>

  <td>${r.profit_as_per_invoice}</td>
  <td>${r.profit_as_per_actual}</td>
`;

    tbody.appendChild(tr);
  });
}

// =======================
// INITIAL LOAD
// =======================
loadReport();


// =========================================================================================
const ledgerTbody = document.getElementById("ledgerTbody");
const ledgerApplyBtn = document.getElementById("ledgerApplyBtn");

ledgerApplyBtn.addEventListener("click", loadLedger);

async function loadLedger() {
  const site = document.getElementById("ledgerSite").value.trim();
  const invoice = document.getElementById("ledgerInvoice").value.trim();
  const month = document.getElementById("ledgerMonth").value;

  const params = new URLSearchParams();
  if (site) params.append("site_name", site);
  if (invoice) params.append("invoice_no", invoice);
  if (month) params.append("month", month);

  try {
    const res = await fetch(
      `http://localhost:5000/api/ledger?${params.toString()}`,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    if (!res.ok) throw new Error("Ledger fetch failed");

    const rows = await res.json();
    renderLedger(rows);

  } catch (err) {
    console.error(err);
    alert("Unable to fetch ledger");
  }
}

function renderLedger(rows) {
  ledgerTbody.innerHTML = "";

  if (!rows.length) {
    ledgerTbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;color:#777;">
          No ledger data
        </td>
      </tr>
    `;
    return;
  }

  rows.forEach(r => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.site_name}</td>
      <td>${r.month}</td>
      <td>${r.invoice_no}</td>
      <td>${r.total_to_client}</td>
      <td>${r.payment}</td>
      <td>${r.month_wise_due}</td>
      <td>${r.closing_balance_monthly}</td>
      <td style="font-weight:700;color:${r.status === "Done" ? "green" : r.status === "Excess"? "orange"
      : "red"}">
      ${r.status}
      </td>
    `;

    ledgerTbody.appendChild(tr);
  });
}

loadLedger()

// ===================================================================================================

const commissionLedgerTbody = document.getElementById("commissionLedgerTbody");
const cApplyBtn = document.getElementById("cApplyBtn");

cApplyBtn.addEventListener("click", loadCommissionLedger);

async function loadCommissionLedger() {
  const site = document.getElementById("cSiteFilter").value.trim();
  const invoice = document.getElementById("cInvoiceFilter").value.trim();
  const month = document.getElementById("cMonthFilter").value;

  const params = new URLSearchParams();
  if (site) params.append("site_name", site);
  if (invoice) params.append("invoice_no", invoice);
  if (month) params.append("month", month);

  try {
    const res = await fetch(
      `http://localhost:5000/api/commission-ledger?${params.toString()}`,
      { headers: { Authorization: "Bearer " + token } }
    );

    if (!res.ok) throw new Error("Fetch failed");

    const rows = await res.json();
    renderCommissionLedger(rows);

  } catch (err) {
    console.error(err);
    alert("Unable to fetch commission ledger");
  }
}

function renderCommissionLedger(rows) {
  commissionLedgerTbody.innerHTML = "";

  if (!rows.length) {
    commissionLedgerTbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;color:#777;">
          No commission ledger data
        </td>
      </tr>
    `;
    return;
  }

  rows.forEach(r => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.site_name}</td>
      <td>${r.month}</td>
      <td>${r.invoice_no}</td>
      <td>${r.total_to_client}</td>
      <td>${r.payment}</td>
      <td>${r.month_wise_due}</td>
      <td>${r.closing_balance_monthly}</td>
      <td style="font-weight:700;color:${r.status === "Done" ? "green" : r.status === "Excess"? "orange"
      : "red"}">
      ${r.status}
      </td>
    `;

    commissionLedgerTbody.appendChild(tr);
  });
}

loadCommissionLedger()
