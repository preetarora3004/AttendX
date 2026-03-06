import { authorizeRole } from "@workspace/backend/middlewares/role.middleware";
import { TeacherController } from "@workspace/backend/modules/teacher/teacher.controller"
import { Router } from "express"

const router = Router();
const controller = new TeacherController();

router.post("/class", authorizeRole, controller.createClass);
router.post("/subject", authorizeRole, controller.createSubject);
router.post("/lecture", authorizeRole, controller.createLecture);
router.post("/event", authorizeRole, controller.createEvent);
router.post("/timeTable", authorizeRole, controller.createTimeTable);

export default router;