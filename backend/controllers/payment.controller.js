const db = require("../config/db");

exports.savePayment = (req, res) => {
  const {
    site_name,
    month,
    invoice_no,
    payment_amount,
    payment_date,
    reference_no,
    total_to_client
  } = req.body;

 const status =
    Number(payment_amount) > Number(total_to_client)
      ? "Excess"
      : Number(payment_amount) === Number(total_to_client)
      ? "Done"
      : "Pending";

  const sql = `
    INSERT INTO dashboard_payments
      (site_name, billing_month, invoice_number, site_payment, payment_date, payment_status, reference_no)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      site_payment = VALUES(site_payment),
      payment_status = VALUES(payment_status)
  `;

  db.query(
    sql,
    [site_name, month, invoice_no, payment_amount, payment_date, status, reference_no],
    err => {
      if (err) {
        console.error("Payment Save Error:", err);
        return res.status(500).json({ error: "Failed to save payment" });
      }
      res.json({ message: "Payment saved", payment_status: status });
    }
  );
};
