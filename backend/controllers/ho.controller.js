const db = require("../config/db");

exports.addHoEmployees = (req, res) => {
  const { assignMonth, employees } = req.body;

  if (!employees || employees.length === 0) {
    return res.status(400).json({ error: "No employee data provided" });
  }

  const values = employees.map(emp => [
    assignMonth,
    emp.employeeId,
    emp.employeeName,
    emp.salary,
    emp.conveyance,
    emp.impressed,
    emp.total
  ]);

  const query = `
    INSERT INTO ho_employees 
    (assign_month, manager_id, employee_name, salary, conveyance, impressed, total)
    VALUES ?
  `;

  db.query(query, [values], (err) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Failed to save HO employees" });
    }

    res.status(201).json({ message: "HO employees saved successfully" });
  });
};
