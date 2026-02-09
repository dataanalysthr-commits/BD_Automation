const db = require("../config/db");

exports.addClientCommission = (req, res) => {
  const {
    commissionMonth,
    clientInvoiceNumber,
    clientInvoiceDate,
    siteName,
    commissionInvoice,
    commissionActual
  } = req.body;

  const query = `
    INSERT INTO client_commission 
    (commission_month, client_invoice_number, client_invoice_date, site_name, commission_invoice, commission_actual)
    VALUES (?, ?, ?, ?, ?,?)
  `;

  db.query(
    query,
    [commissionMonth, clientInvoiceNumber, clientInvoiceDate, siteName, commissionInvoice, commissionActual],
    (err) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: "Failed to save commission data" });
      }

      res.status(201).json({ message: "Commission data saved successfully" });
    }
  );
};
