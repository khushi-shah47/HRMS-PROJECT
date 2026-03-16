// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

import employeeRoutes from "./routes/employeeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import wfhRoutes from './routes/wfhRoutes.js';
import holidayRoutes from "./routes/holidayRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { connectDB } from "./config/sequelize.js";
import profileRoutes from "./routes/profileRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/wfh", wfhRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});