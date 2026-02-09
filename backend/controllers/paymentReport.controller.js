const db = require("../config/db");

exports.getReport = (req, res) => {
  const { site_name, month, invoice_number } = req.query;

  let sql = `
    SELECT
      site_name,
      invoice_no,
      month,
      total_to_client,
      payment_amount,
      payment_status
    FROM payment_status_dashboard
    WHERE 1 = 1
  `;

  const params = [];

  if (site_name) {
    sql += " AND site_name LIKE ?";
    params.push(`%${site_name}%`);
  }

  if (invoice_number) {
    sql += " AND invoice_no LIKE ?";
    params.push(`%${invoice_number}%`);
  }

  if (month) {
    sql += " AND month LIKE ?";
    params.push(`%${month}%`);
  }

  sql += " ORDER BY month DESC, site_name";

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error("Payment Report Error:", err);
      return res.status(500).json({ error: "Failed to fetch payment report" });
    }

    res.json(rows);
  });
};
