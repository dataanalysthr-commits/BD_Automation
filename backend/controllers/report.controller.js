const db = require("../config/db");

exports.getFinancialSummary = (req, res) => {
  const { site_name, month, manager_id } = req.query;

  let query = `
    SELECT
      site_name,
      month,
      manager_id,

      salary_invoice_total,
      salary_actual_total,

      total_service_fee_per_actual,
      total_material_cost_per_invoice,
      total_material_cost_per_actual,

      total_commission_invoice,
      total_commission_actual,

      total_to_client,
      total_actual_exp_against_invoice_to_client,

      salary,
      conveyance,
      impressed,

      profit_as_per_invoice,
      profit_as_per_actual

    FROM financial_summary_report
    WHERE 1 = 1
  `;

  const params = [];

  if (site_name) {
    query += " AND site_name LIKE ?";
    params.push(`%${site_name}%`);
  }

  if (month) {
    query += " AND month LIKE ?";
    params.push(`%${month}%`);
  }

  if (manager_id) {
    query += " AND manager_id LIKE ?";
    params.push(`%${manager_id}%`);
  }

  query += " ORDER BY month DESC, site_name";

  db.query(query, params, (err, rows) => {
    if (err) {
      console.error("Report Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch report" });
    }

    res.json(rows);
  });
};
