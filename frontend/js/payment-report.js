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
applyOnEnter("#PRFilters", loadReport);

// =============================================================================

const goCommissionBtn = document.getElementById("goCommissionBtn");

if (goCommissionBtn) {
  goCommissionBtn.addEventListener("click", () => {
    window.location.href = "compayment-report.html";
  });
}

const token = localStorage.getItem("facility_auth");
if (!token) window.location.href = "login.html";

const API = "http://localhost:5000/api/payment-report/total-to-client";

const tbody = document.getElementById("reportBody");
const applyBtn = document.getElementById("applyBtn");
const logoutBtn = document.getElementById("logoutBtn");

applyBtn.addEventListener("click", loadReport);

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// -----------------------------
// MAIN FUNCTION
// -----------------------------
async function loadReport() {
  const site = document.getElementById("siteInput").value.trim();
  const invoice = document.getElementById("invoiceInput").value.trim();
  const month = document.getElementById("monthInput").value;
  const paymentAmount = Number(document.getElementById("paymentInput").value || 0);

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

    // 🔴 THIS IS IMPORTANT
    renderTable(rows, paymentAmount);

  } catch (err) {
    console.error("Fetch error:", err);
    alert("Failed to fetch data");
  }
}

// -----------------------------
// RENDER TABLE
// -----------------------------
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
      <td>${r.total_to_client}</td>
      <td>${r.payment_amount}</td>
      <td style="font-weight:700;color:${r.payment_status === "Done" ? "green" : r.payment_status === "Excess"? "orange"
      : "red"}">
      ${r.payment_status}
      </td>
    `;

    tbody.appendChild(tr);
  });
}
loadReport();