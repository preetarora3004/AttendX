import { Router } from "express";
import { UserController } from "@workspace/backend/modules/user/user.controller";
import { authMiddleware } from "@workspace/backend/middlewares/auth.middleware";

const router = Router();
const controller = new UserController();

router.get("/:id", authMiddleware, controller.getById);
router.post("/signup", controller.create);
router.post("/signin", controller.getByCredentials);

export default router;

