
const db = require("../config/db");

exports.saveCommissionPayment = (req, res) => {
  const {
    site_name,
    month,
    invoice_no,
    payment_amount,
    payment_date,
    reference_no,
    total_commission_to_client
  } = req.body;


  const payment_status =
    Number(payment_amount) > Number(total_commission_to_client)
      ? "Excess"
      : Number(payment_amount) === Number(total_commission_to_client)
      ? "Done"
      : "Pending"; 

  const sql = `
    INSERT INTO commission_payments
      (site_name, commission_month, invoice_number, commission_payment, payment_date, payment_status, reference_no)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      commission_payment = VALUES(commission_payment),
      payment_date = VALUES(payment_date),
      payment_status = VALUES(payment_status)
  `;

  const params = [
     site_name,
    month,
    invoice_no,
    payment_amount,
    payment_date || null,
    payment_status,
    reference_no || null
  ];

  db.query(sql, params, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save commission payment" });
    }

    res.json({
      message: "Commission payment saved",
      payment_status
    });
  });
};
