const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";

  const username = document.getElementById("userId").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const result = await res.json();

    if (res.ok) {
  localStorage.setItem("facility_auth", result.token);
  localStorage.setItem("facility_allowed_page", result.allowedPage);

  // Redirect based on allowed page
  if (result.allowedPage === "dashboard") {
    window.location.href = "dashboard.html";
  } else if (result.allowedPage === "ho") {
    window.location.href = "ho.html";
  } else if (result.allowedPage === "commission") {
    window.location.href = "commission.html";
  } else if (result.allowedPage === "report") {
    window.location.href = "report.html";
  } else if (result.allowedPage === "payment") {
    window.location.href = "payment.html";
  } else if (result.allowedPage === "payment-report") {
    window.location.href = "payment-report.html";
  } else if (result.allowedPage === "commission-report") {
    window.location.href = "compayment-report.html";
  } else {
    loginError.textContent = "No page access assigned.";
  }
}

  } catch (error) {
    console.error(error);
    loginError.textContent = "Server not reachable";
  }
});
