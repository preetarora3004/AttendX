import "dotenv/config";
import cors from "cors";
import express from "express";
import userRoutes from "@workspace/backend/modules/user/user.route";
import qrRoutes from "@workspace/backend/modules/qrcode/qrcode.routes";
import studentRoutes from "@workspace/backend/modules/student/student.route";
import teacherRoutes from "@workspace/backend/modules/teacher/teacher.routes";
import { errorMiddleware } from "@workspace/backend/middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/qr", qrRoutes);
app.use("/api/user", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);

app.use(errorMiddleware);

export default app;