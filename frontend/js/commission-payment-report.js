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
applyOnEnter("#PRFilters", loadCommissionReport);
// ================================================


const goPaymentBtn = document.getElementById("goPaymentBtn");

if (goPaymentBtn) {
  goPaymentBtn.addEventListener("click", () => {
    window.location.href = "payment-report.html";
  });
}

// =======================
// AUTH
// =======================
const token = localStorage.getItem("facility_auth");
if (!token) window.location.href = "login.html";

// =======================
// CONSTANTS
// =======================
const API = "http://localhost:5000/api/commission-payment-report/report";
;

const tbody = document.getElementById("reportBody");
const applyBtn = document.getElementById("applyBtn");
const logoutBtn = document.getElementById("logoutBtn");

// =======================
// EVENTS
// =======================
applyBtn.addEventListener("click", loadCommissionReport);

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// =======================
// LOAD REPORT
// =======================
async function loadCommissionReport() {
  const site = document.getElementById("siteInput").value.trim();
  const invoice = document.getElementById("invoiceInput").value.trim();
  const month = document.getElementById("monthInput").value;

  const params = new URLSearchParams();
  if (site) params.append("site_name", site);
  if (invoice) params.append("invoice_number", invoice);
  if (month) params.append("month", month);

  try {
    const res = await fetch(`${API}?${params.toString()}`, {
      headers: { Authorization: "Bearer " + token }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const rows = await res.json();
    renderTable(rows);

  } catch (err) {
    console.error("Fetch error:", err);
    alert("Failed to fetch commission report");
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
        <td colspan="6" style="text-align:center;color:#777;">
          No data found
        </td>
      </tr>
    `;
    return;
  }

  rows.forEach(r => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.site_name}</td>
      <td>${r.invoice_no}</td>
      <td>${r.month}</td>
      <td>${r.total_commission_to_client}</td>
      <td>${r.payment_amount}</td>
      <td style="font-weight:700;color:${r.payment_status === "Done" ? "green" : r.payment_status === "Excess"? "orange"
      : "red"}">
      ${r.payment_status}
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// =======================
// INITIAL LOAD
// =======================
loadCommissionReport();
