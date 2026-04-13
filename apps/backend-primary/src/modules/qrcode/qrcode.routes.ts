import { Router } from "express";
import { QrCodeController } from "@workspace/backend/modules/qrcode/qrcode.controller";
import { authorizeRole } from "@workspace/backend/middlewares/role.middleware";
import { authMiddleware } from "@workspace/backend/middlewares/auth.middleware";

const router = Router();
const controller = new QrCodeController();

router.post("/create", controller.create);
router.get("/verify/:token", authMiddleware, controller.verify);

export default router;
