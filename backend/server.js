require("dotenv").config();
const express = require("express");
const cors = require("cors");

const commissionRoutes = require("./routes/commission.routes");
const hoRoutes = require("./routes/ho.routes");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const reportRoutes = require("./routes/report.routes");
const paymentRoutes = require("./routes/payment.routes");
const paymentReportRoutes = require("./routes/paymentReport.routes");
const commissionPaymentRoutes = require("./routes/commission-payment.routes");
const commissionPaymentReportRoutes = require("./routes/commission-payment-report.routes");




const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/commission", commissionRoutes);
app.use("/api/ho", hoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/payment-report", require("./routes/paymentReport.routes"));
app.use("/api/commission-payments", commissionPaymentRoutes);
app.use("/api/commission-payment-report", commissionPaymentReportRoutes);
app.use("/api/ledger", require("./routes/ledger.routes"));
app.use("/api/commission-ledger", require("./routes/commission-ledger.routes"));




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
