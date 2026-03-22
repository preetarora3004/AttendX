import "dotenv/config";
import cors from "cors";
import express from "express";
import userRoutes from "@workspace/backend/modules/user/user.route";
import qrRoutes from "@workspace/backend/modules/qrcode/qrcode.routes";
import studentRoutes from "@workspace/backend/modules/student/student.route";
import teacherRoutes from "@workspace/backend/modules/teacher/teacher.routes";
import attendanceRouter from "@workspace/backend/modules/attendance/attendance.route"
import { errorMiddleware } from "@workspace/backend/middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", userRoutes);
app.use("/api/v1/qr", qrRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/teacher", teacherRoutes);
app.use("api/v1/attendanace", attendanceRouter);

app.use(errorMiddleware);

export default app;