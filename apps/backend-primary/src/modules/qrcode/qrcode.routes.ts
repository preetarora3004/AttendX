import { Router } from "express";
import { QrCodeController } from "@workspace/backend/modules/qrcode/qrcode.controller";
import { authorizeRole } from "@workspace/backend/middlewares/role.middleware";
import { authMiddleware } from "@workspace/backend/middlewares/auth.middleware";

const router = Router();
const controller = new QrCodeController();

router.post("/qr-create", authorizeRole, controller.create);
router.get("/qr-verify", authMiddleware, controller.verify);