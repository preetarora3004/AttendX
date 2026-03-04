import express from "express"
import "dotenv/config"
import cors from "cors";
import userRoutes from "@workspace/backend/modules/user/user.route"
import studentRoutes from "@workspace/backend/modules/student/student.route"
import { errorMiddleware } from "@workspace/backend/middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/student", studentRoutes);

app.use(errorMiddleware)

export default app;