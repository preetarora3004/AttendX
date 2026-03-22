import { Router } from "express";
import { StudentController } from "@workspace/backend/modules/student/student.controller";
import { authMiddleware } from "@workspace/backend/middlewares/auth.middleware";

const router = Router();
const controller = new StudentController();

router.post("/enroll-student", authMiddleware, controller.create);
router.get("/get-student", authMiddleware, controller.getStudent);
router.get("/timeTable", authMiddleware, controller.getTimeTableByUserId);
router.post("/join-event/:eventId", authMiddleware, controller.joinEvent);
router.get("/get-timeTable", authMiddleware, controller.getTimeTable);

export default router;