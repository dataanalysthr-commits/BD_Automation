

const db = require("../config/db");

exports.getCommissionReport = (req, res) => {
  const { site_name, invoice_number, month } = req.query;

  let sql = `
    SELECT
    site_name,
    invoice_number      AS invoice_no,
    commission_month    AS month,
    commission_invoice  AS total_commission_to_client,
    commission_payment AS payment_amount,
    payment_status
    FROM commission_status_dashboard
    WHERE 1=1
  `;

  const params = [];

  if (site_name) {
    sql += " AND site_name LIKE ?";
    params.push(`%${site_name}%`);
  }

  if (invoice_number) {
    sql += " AND invoice_number LIKE ?";
    params.push(`%${invoice_number}%`);
  }

  if (month) {
    sql += " AND commission_month LIKE ?";
    params.push(`%${month}%`);
  }

  sql += " ORDER BY commission_month DESC, site_name";

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch commission report" });
    }
    res.json(rows);
  });
};
