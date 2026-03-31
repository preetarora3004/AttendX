import { Router } from "express";
import { StudentController } from "@workspace/backend/modules/student/student.controller";
import { authMiddleware } from "@workspace/backend/middlewares/auth.middleware";

const router = Router();
const controller = new StudentController();

router.post("/enroll-student", authMiddleware, controller.create);
router.get("/get-student", authMiddleware, controller.getStudent);
router.post("/join-event/:eventId", authMiddleware, controller.joinEvent);

export default router;