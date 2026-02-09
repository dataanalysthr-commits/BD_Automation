const db = require("../config/db");

// Save Site + Employees
exports.saveSiteEmployees = (req, res) => {
  const { siteDetails, employees } = req.body;

  const {
    siteName,
    invoiceNo,
    managerId,
    reportingManager,
    updateDate,
    billingMonth
  } = siteDetails;

  const values = employees.map(emp => [
    siteName,
    invoiceNo,
    managerId,
    reportingManager,
    updateDate,
    billingMonth,
    emp.designation,
    emp.serviceProvided,
    emp.employeeName,
    emp.salaryInvoice,
    emp.salaryActual
  ]);

  const query = `
    INSERT INTO site_employees
    (site_name, invoice_no, manager_id, reporting_manager, update_date, billing_month,
     designation, service_provided, employee_name, salary_invoice, salary_actual)
    VALUES ?
  `;

  db.query(query, [values], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save site employees" });
    }
    res.json({ message: "Site & employees saved successfully" });
  });
};

// Save Client Charges
exports.saveClientCharges = (req, res) => {
  const {
    invoiceNo,
    siteName,
    managerId,
    reportingManager,
    updateDate,
    billingMonth,

    serviceFeePercent,
    serviceFeeInvoiceAmount,
    serviceFeeActualAmount,
    serviceFeeDate,

    materialCostPercent,
    materialCostInvoiceAmount,
    materialCostActualAmount,
    materialCostDate
  } = req.body;

  const query = `
    INSERT INTO client_charges
    (
      invoice_no,
      site_name,
      manager_id,
      reporting_manager,
      update_date,
      billing_month,

      service_fee_percent,
      service_fee_invoice_amount,
      service_fee_actual_amount,
      service_fee_date,

      material_cost_percent,
      material_cost_invoice_amount,
      material_cost_actual_amount,
      material_cost_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    invoiceNo,
    siteName,
    managerId,
    reportingManager,
    updateDate,
    billingMonth,

    serviceFeePercent,
    serviceFeeInvoiceAmount,
    serviceFeeActualAmount,
    serviceFeeDate,

    materialCostPercent,
    materialCostInvoiceAmount,
    materialCostActualAmount,
    materialCostDate
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Error saving client charges:", err);
      return res.status(500).json({ error: "Failed to save client charges" });
    }

    res.json({
      message: "Client charges saved with site details successfully",
      id: result.insertId
    });
  });
};
