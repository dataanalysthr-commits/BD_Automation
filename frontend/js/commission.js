const token = localStorage.getItem("facility_auth");
const allowedPage = localStorage.getItem("facility_allowed_page");

if (!token || allowedPage !== "commission") {
  window.location.href = "login.html";
}


const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("facility_auth");
    localStorage.removeItem("facility_auth_user");
    window.location.href = "login.html";
  });
}

document.getElementById("commissionForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    commissionMonth: document.getElementById("commissionMonth").value,
    clientInvoiceNumber: document.getElementById("clientInvoiceNumber").value,
    clientInvoiceDate: document.getElementById("clientInvoiceDate").value,
    siteName: document.getElementById("siteName").value,
    commissionInvoice: document.getElementById("commissionInvoice").value,
    commissionActual: document.getElementById("commissionActual").value
  };

  const statusMsg = document.getElementById("statusMsg");

  try {
    const res = await fetch("http://localhost:5000/api/commission/add", {
      method: "POST",
      headers: { "Content-Type": "application/json",
                  "Authorization": "Bearer " + token
       },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      statusMsg.innerText = result.message;
      statusMsg.style.color = "green";
      document.getElementById("commissionForm").reset();
    } else {
      statusMsg.innerText = result.error || "Something went wrong";
      statusMsg.style.color = "red";
    }
  } catch (error) {
    console.error(error);
    statusMsg.innerText = "Server not reachable";
    statusMsg.style.color = "red";
  }
});
