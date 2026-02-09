// const token = localStorage.getItem("facility_auth");
// const allowedPage = localStorage.getItem("facility_allowed_page");

// if (!token || allowedPage !== "ho") {
//   window.location.href = "login.html";
// }
// // =======================
// // LOGOUT
// // =======================
// const logoutBtn = document.getElementById("logoutBtn");
// if (logoutBtn) {
//   logoutBtn.addEventListener("click", () => {
//     localStorage.removeItem("facility_auth");
//     localStorage.removeItem("facility_auth_user");
//     window.location.href = "login.html";
//   });
// }


// const hoTbody = document.getElementById("hoTbody");
// const addBtn = document.getElementById("addHoEmployeeBtn");
// const saveBtn = document.getElementById("saveHoBtn");
// const clearBtn = document.getElementById("clearHoBtn");
// const statusMsg = document.getElementById("statusMsg");
// const monthInput = document.querySelector(".month-input");

// // Add new row
// addBtn.addEventListener("click", () => {
//   const row = document.createElement("tr");

//   row.innerHTML = `
//     <td><input type="text" class="mini-input emp-id" placeholder="e.g., HO-101"></td>
//     <td><input type="text" class="mini-input emp-name" placeholder="e.g., Rakesh Kumar"></td>
//     <td><input type="number" class="mini-input salary" placeholder="0"></td>
//     <td><input type="number" class="mini-input conveyance" placeholder="0"></td>
//     <td><input type="number" class="mini-input impressed" placeholder="0"></td>
//     <td><span class="total-pill">0.00</span></td>
//     <td><button class="btn ghost small remove-btn">Remove</button></td>
//   `;

//   hoTbody.appendChild(row);

//   attachRowEvents(row);
// });

// // Attach calculation + remove events
// function attachRowEvents(row) {
//   const salaryInput = row.querySelector(".salary");
//   const conveyanceInput = row.querySelector(".conveyance");
//   const impressedInput = row.querySelector(".impressed");
//   const totalSpan = row.querySelector(".total-pill");
//   const removeBtn = row.querySelector(".remove-btn");

//   function calculateTotal() {
//     const salary = parseFloat(salaryInput.value) || 0;
//     const conveyance = parseFloat(conveyanceInput.value) || 0;
//     const impressed = parseFloat(impressedInput.value) || 0;
//     const total = salary + conveyance + impressed;
//     totalSpan.innerText = total.toFixed(2);
//   }

//   salaryInput.addEventListener("input", calculateTotal);
//   conveyanceInput.addEventListener("input", calculateTotal);
// impressedInput.addEventListener("input", calculateTotal);
//   removeBtn.addEventListener("click", () => {
//     row.remove();
//   });
// }

// // Save to backend
// saveBtn.addEventListener("click", async () => {
//   const rows = document.querySelectorAll("#hoTbody tr");
//   const assignMonth = monthInput.value;

//   if (!assignMonth) {
//     statusMsg.innerText = "Please select month.";
//     statusMsg.style.color = "red";
//     return;
//   }

//   const employees = [];

//   rows.forEach(row => {
//     const employeeId = row.querySelector(".emp-id").value;
//     const employeeName = row.querySelector(".emp-name").value;
//     const salary = row.querySelector(".salary").value;
//     const conveyance = row.querySelector(".conveyance").value;
//     const impressed = row.querySelector(".impressed").value;
//     const total = row.querySelector(".total-pill").innerText;

//     if (employeeId && employeeName) {
//       employees.push({
//         employeeId,
//         employeeName,
//         salary,
//         conveyance,
//         impressed,
//         total
//       });
//     }
//   });

//   if (employees.length === 0) {
//     statusMsg.innerText = "Please add at least one employee.";
//     statusMsg.style.color = "red";
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:5000/api/ho/add", {
//       method: "POST",
//       headers: {
//   "Content-Type": "application/json",
//   "Authorization": "Bearer " + token
// },
//       body: JSON.stringify({ assignMonth, employees })
//     });

//     const result = await res.json();

//     if (res.ok) {
//       statusMsg.innerText = result.message;
//       statusMsg.style.color = "green";
//       hoTbody.innerHTML = "";
//       monthInput.value = "";
//     } else {
//       statusMsg.innerText = result.error || "Failed to save";
//       statusMsg.style.color = "red";
//     }
//   } catch (error) {
//     console.error(error);
//     statusMsg.innerText = "Server not reachable";
//     statusMsg.style.color = "red";
//   }
// });

// // Clear
// clearBtn.addEventListener("click", () => {
//   hoTbody.innerHTML = "";
//   monthInput.value = "";
//   statusMsg.innerText = "";
// });

// =======================
// AUTH GUARD (unchanged)
// =======================
const token = localStorage.getItem("facility_auth");
const allowedPage = localStorage.getItem("facility_allowed_page");

if (!token || allowedPage !== "ho") {
  window.location.href = "login.html";
}

// =======================
// LOGOUT (unchanged)
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
// ELEMENTS (existing + file input)
// =======================
const hoTbody = document.getElementById("hoTbody");
const addBtn = document.getElementById("addHoEmployeeBtn");
const saveBtn = document.getElementById("saveHoBtn");
const clearBtn = document.getElementById("clearHoBtn");
const statusMsg = document.getElementById("statusMsg");
const monthInput = document.querySelector(".month-input");

// NEW: file input (you already added in HTML)
const employeeFileInput = document.getElementById("employeeFile");

// =======================
// ROW HELPERS (NEW, but does not change existing behavior)
// =======================

// Create a row (used by manual add and file import)
function createHoRow({
  employeeId = "",
  employeeName = "",
  salary = "",
  conveyance = "",
  impressed = ""
} = {}) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input type="text" class="mini-input emp-id" placeholder="e.g., HO-101" value="${escapeAttr(
      employeeId
    )}"></td>
    <td><input type="text" class="mini-input emp-name" placeholder="e.g., Rakesh Kumar" value="${escapeAttr(
      employeeName
    )}"></td>
    <td><input type="number" class="mini-input salary" placeholder="0" value="${escapeAttr(
      salary
    )}"></td>
    <td><input type="number" class="mini-input conveyance" placeholder="0" value="${escapeAttr(
      conveyance
    )}"></td>
    <td><input type="number" class="mini-input impressed" placeholder="0" value="${escapeAttr(
      impressed
    )}"></td>
    <td><span class="total-pill">0.00</span></td>
    <td><button class="btn ghost small remove-btn">Remove</button></td>
  `;

  hoTbody.appendChild(row);
  attachRowEvents(row); // keeps your calc/remove logic

  // Trigger total calculation once for prefilled values
  const salaryInput = row.querySelector(".salary");
  salaryInput.dispatchEvent(new Event("input"));

  return row;
}

// Prevent breaking HTML attributes if file has quotes etc.
function escapeAttr(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toNumber(v) {
  if (v === null || v === undefined) return 0;
  const n = Number(String(v).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

// Clear rows only (used for import)
function clearRowsOnly() {
  hoTbody.innerHTML = "";
}

// =======================
// Add new row (existing behavior preserved)
// =======================
addBtn.addEventListener("click", () => {
  // previously you built innerHTML inline; now we reuse helper
  createHoRow();
});

// =======================
// Attach calculation + remove events (UNCHANGED functionality)
// =======================
function attachRowEvents(row) {
  const salaryInput = row.querySelector(".salary");
  const conveyanceInput = row.querySelector(".conveyance");
  const impressedInput = row.querySelector(".impressed");
  const totalSpan = row.querySelector(".total-pill");
  const removeBtn = row.querySelector(".remove-btn");

  function calculateTotal() {
    const salary = parseFloat(salaryInput.value) || 0;
    const conveyance = parseFloat(conveyanceInput.value) || 0;
    const impressed = parseFloat(impressedInput.value) || 0;
    const total = salary + conveyance + impressed;
    totalSpan.innerText = total.toFixed(2);
  }

  salaryInput.addEventListener("input", calculateTotal);
  conveyanceInput.addEventListener("input", calculateTotal);
  impressedInput.addEventListener("input", calculateTotal);

  removeBtn.addEventListener("click", () => {
    row.remove();
  });
}

// =======================
// SAVE to backend (UNCHANGED)
// =======================
saveBtn.addEventListener("click", async () => {
  const rows = document.querySelectorAll("#hoTbody tr");
  const assignMonth = monthInput.value;

  if (!assignMonth) {
    statusMsg.innerText = "Please select month.";
    statusMsg.style.color = "red";
    return;
  }

  const employees = [];

  rows.forEach((row) => {
    const employeeId = row.querySelector(".emp-id").value;
    const employeeName = row.querySelector(".emp-name").value;
    const salary = row.querySelector(".salary").value;
    const conveyance = row.querySelector(".conveyance").value;
    const impressed = row.querySelector(".impressed").value;
    const total = row.querySelector(".total-pill").innerText;

    if (employeeId && employeeName) {
      employees.push({
        employeeId,
        employeeName,
        salary,
        conveyance,
        impressed,
        total
      });
    }
  });

  if (employees.length === 0) {
    statusMsg.innerText = "Please add at least one employee.";
    statusMsg.style.color = "red";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/ho/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ assignMonth, employees })
    });

    const result = await res.json();

    if (res.ok) {
      statusMsg.innerText = result.message;
      statusMsg.style.color = "green";
      hoTbody.innerHTML = "";
      monthInput.value = "";
    } else {
      statusMsg.innerText = result.error || "Failed to save";
      statusMsg.style.color = "red";
    }
  } catch (error) {
    console.error(error);
    statusMsg.innerText = "Server not reachable";
    statusMsg.style.color = "red";
  }
});

// =======================
// CLEAR (UNCHANGED)
// =======================
clearBtn.addEventListener("click", () => {
  hoTbody.innerHTML = "";
  monthInput.value = "";
  statusMsg.innerText = "";
});

// =======================
// FILE UPLOAD -> AUTOFILL TABLE (NEW, does not affect existing flow)
// =======================
// NOTE: For Excel (.xlsx/.xls) you MUST include SheetJS in HTML:
// <script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"></script>
// before ho.js
if (employeeFileInput) {
  employeeFileInput.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      statusMsg.innerText = "";
      const ext = file.name.split(".").pop().toLowerCase();

      // Replace current rows with uploaded rows
      clearRowsOnly();

      let rows = [];

      if (ext === "csv") {
        const text = await file.text();
        rows = parseCSV(text);
      } else if (ext === "xlsx" || ext === "xls") {
        const buf = await file.arrayBuffer();
        rows = parseExcel(buf);
      } else {
        statusMsg.innerText = "Unsupported file type. Upload .csv, .xlsx, or .xls";
        statusMsg.style.color = "red";
        return;
      }

      // Add rows to table
      rows.forEach((r) => {
        // minimal validation: skip completely blank lines
        const hasAny =
          String(r.employeeId || "").trim() ||
          String(r.employeeName || "").trim() ||
          toNumber(r.salary) ||
          toNumber(r.conveyance) ||
          toNumber(r.impressed);

        if (!hasAny) return;

        createHoRow({
          employeeId: r.employeeId,
          employeeName: r.employeeName,
          salary: r.salary,
          conveyance: r.conveyance,
          impressed: r.impressed
        });
      });

      if (hoTbody.children.length === 0) {
        statusMsg.innerText = "No valid rows found in the uploaded file.";
        statusMsg.style.color = "red";
      } else {
        statusMsg.innerText = `Loaded ${hoTbody.children.length} employee(s) from file.`;
        statusMsg.style.color = "green";
      }
    } catch (err) {
      console.error(err);
      statusMsg.innerText = "Upload failed. Please check file format.";
      statusMsg.style.color = "red";
    } finally {
      // allow selecting same file again
      e.target.value = "";
    }
  });
}

// =======================
// CSV PARSER (NEW)
// Expected columns order:
// Employee ID, Employee Name, Salary, Conveyance, Impressed
// Also supports headers (case-insensitive).
// =======================
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length === 0) return [];

  // Basic CSV split. If your CSV contains commas inside quotes, tell me and I’ll upgrade parser.
  const grid = lines.map((line) => line.split(",").map((c) => c.trim()));

  const header = grid[0].map((h) => h.toLowerCase());
  const hasHeader =
    header.some((h) => h.includes("employee")) ||
    header.some((h) => h.includes("salary")) ||
    header.some((h) => h.includes("conveyance")) ||
    header.some((h) => h.includes("impressed"));

  if (hasHeader) {
    const idx = {
      employeeId: findHeaderIndex(header, ["employee id", "emp id", "employeeid", "empid", "id"]),
      employeeName: findHeaderIndex(header, ["employee name", "emp name", "employeename", "empname", "name"]),
      salary: findHeaderIndex(header, ["salary"]),
      conveyance: findHeaderIndex(header, ["conveyance"]),
      impressed: findHeaderIndex(header, ["impressed", "imprest"])
    };

    return grid.slice(1).map((r) => ({
      employeeId: r[idx.employeeId] ?? r[0] ?? "",
      employeeName: r[idx.employeeName] ?? r[1] ?? "",
      salary: r[idx.salary] ?? r[2] ?? "",
      conveyance: r[idx.conveyance] ?? r[3] ?? "",
      impressed: r[idx.impressed] ?? r[4] ?? ""
    }));
  }

  // No headers: use fixed order
  return grid.map((r) => ({
    employeeId: r[0] ?? "",
    employeeName: r[1] ?? "",
    salary: r[2] ?? "",
    conveyance: r[3] ?? "",
    impressed: r[4] ?? ""
  }));
}

function findHeaderIndex(headerArr, candidates) {
  for (const c of candidates) {
    const i = headerArr.findIndex((h) => h === c || h.replace(/\s+/g, "") === c.replace(/\s+/g, ""));
    if (i !== -1) return i;
  }
  return -1;
}

// =======================
// EXCEL PARSER (NEW) using SheetJS
// Expected columns order:
// Employee ID, Employee Name, Salary, Conveyance, Impressed
// Or headers similar to those.
// =======================
function parseExcel(arrayBuffer) {
  if (typeof XLSX === "undefined") {
    throw new Error("SheetJS not found. Include xlsx.full.min.js before ho.js");
  }

  const wb = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];

  // Try reading as objects (header row)
  const json = XLSX.utils.sheet_to_json(ws, { defval: "" });

  if (json.length > 0 && typeof json[0] === "object" && !Array.isArray(json[0])) {
    return json.map((obj) => {
      const lower = {};
      Object.keys(obj).forEach((k) => (lower[String(k).toLowerCase().trim()] = obj[k]));

      const pick = (keys) => {
        for (const k of keys) {
          if (k in lower) return lower[k];
        }
        return "";
      };

      return {
        employeeId: pick(["employee id", "emp id", "employeeid", "empid", "id"]),
        employeeName: pick(["employee name", "emp name", "employeename", "empname", "name"]),
        salary: pick(["salary"]),
        conveyance: pick(["conveyance"]),
        impressed: pick(["impressed", "imprest"])
      };
    });
  }

  // Fallback: 2D array
  const arr = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  const data = arr.slice(1); // assume first row is header
  return data.map((r) => ({
    employeeId: r[0] ?? "",
    employeeName: r[1] ?? "",
    salary: r[2] ?? "",
    conveyance: r[3] ?? "",
    impressed: r[4] ?? ""
  }));
}
