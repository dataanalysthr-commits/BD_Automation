

// =======================
// SAVE COMMISSION PAYMENT
// =======================
const savePaymentBtn = document.getElementById("savePaymentBtn");

if (savePaymentBtn) {
  savePaymentBtn.addEventListener("click", async () => {
    const site = document.getElementById("siteInput").value.trim();
    const invoice = document.getElementById("invoiceInput").value.trim();
    const month = document.getElementById("monthInput").value;
    const paymentAmount = Number(document.getElementById("paymentInput").value);
    const paymentDate = document.getElementById("paymentDateInput").value;
    const referenceNo = document.getElementById("referenceInput").value.trim();


    // Get total commission from table (4th column)
    const totalCell = document.querySelector("#reportBody tr td:nth-child(4)");
    if (!totalCell) {
      alert("Fetch commission data first");
      return;
    }

    const totalCommission = Number(totalCell.innerText);

    try {
      const res = await fetch(
        "http://localhost:5000/api/commission-payments/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({
            site_name: site,
            invoice_no: invoice,
            month,
            payment_amount: paymentAmount,
            payment_date: paymentDate,
            reference_no :referenceNo || null,
            total_commission_to_client: totalCommission
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save commission payment");
      }

      alert("Commission payment saved successfully");

      // 🔄 Reload report after save
      loadCommissionReport();

    } catch (err) {
      console.error(err);
      alert("Unable to save commission payment");
    }
  });
}
