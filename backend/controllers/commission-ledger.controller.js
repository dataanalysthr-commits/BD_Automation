const db = require("../config/db");

exports.getCommissionLedger = (req, res) => {
  const { site_name, invoice_no, month } = req.query;

  let sql = `
    SELECT
      site_name,
      month,
      invoice_no,
      total_to_client,
      payment,
      month_wise_due,
      closing_balance_monthly,
      status
    FROM ledger_commission_view
    WHERE 1=1
  `;

  const params = [];

  if (site_name) {
    sql += " AND site_name LIKE ?";
    params.push(`%${site_name}%`);
  }


  if (invoice_no) {
    sql += " AND invoice_no LIKE ?";
    params.push(`%${invoice_no}%`);
  }

  if (month) {
    sql += " AND month LIKE ?";
    params.push(`%${month}%`);
  }

  sql += " ORDER BY site_name, month";

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error("Commission Ledger Error:", err);
      return res.status(500).json({ error: "Failed to fetch commission ledger" });
    }
    res.json(rows);
  });
};

