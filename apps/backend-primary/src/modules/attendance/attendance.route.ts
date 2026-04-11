import { authMiddleware } from "@workspace/backend/middlewares/auth.middleware";
import { AttendanceController } from "@workspace/backend/modules/attendance/attendance.controller";
import { Router } from "express";

const router = Router();
const controller = new AttendanceController();

router.post("/present-class/:lectureId/:studentId", controller.markPresent);
router.post("/absent-class/:lectureId/:studentId", authMiddleware, controller.markAbsent);
router.post("/present-event/:eventId/:studentId", authMiddleware, controller.markEventPresent);
router.post("/absent-event/:eventId/:studentId", authMiddleware, controller.markEventAbsent);
router.get("/get-attendance", authMiddleware, controller.getAttendance);

export default router;

