import { authMiddleware } from "@workspace/backend/middlewares/auth.middleware";
import { authorizeRole } from "@workspace/backend/middlewares/role.middleware";
import { TeacherController } from "@workspace/backend/modules/teacher/teacher.controller"
import { Router } from "express"

const router = Router();
const controller = new TeacherController();

router.post("/enroll-teacher", authMiddleware, controller.createTeacher);
router.get("/get-teacher/dashboard", authMiddleware, controller.getTeacherDashboard);
router.get("/get-teacher", authMiddleware, controller.getTeacherById);
router.post("/class", authorizeRole, controller.createClass);
router.post("/subject", authorizeRole, controller.createSubject);
router.post("/lecture", controller.createLecture);
router.post("/event", authorizeRole, controller.createEvent);
router.post("/timeTable", authorizeRole, controller.createTimeTable);

export default router;