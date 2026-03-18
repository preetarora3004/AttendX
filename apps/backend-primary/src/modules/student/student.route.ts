import { Router } from "express";
import { StudentController } from "@workspace/backend/modules/student/student.controller";
import { authMiddleware } from "@workspace/backend/middlewares/auth.middleware";
import { authorizeRole } from "@workspace/backend/middlewares/role.middleware";

const router = Router();
const controller = new StudentController();

router.post("/enrole-student", authorizeRole, controller.create);
router.get("/attendance/:studentId/:subjectId", authMiddleware, controller.getAttendance);
router.get("/get-student", authMiddleware, controller.getStudent);
router.post("markAttendance/:studentId/:lectureId", authMiddleware, controller.markAttendance);
router.get("/timeTable", authMiddleware, controller.getTimeTableByUserId);
router.post("/join-event/:eventId", authMiddleware, controller.joinEvent);
router.get("/get-timeTable", authMiddleware, controller.getTimeTable);

export default router;