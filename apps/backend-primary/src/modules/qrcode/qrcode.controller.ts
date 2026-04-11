import { QrCodeService } from "@workspace/backend/modules/qrcode/qrcode.service";
import { Response, Request, NextFunction } from "express";
import { validateQrCreation } from "@workspace/backend/modules/qrcode/qrcode.validator";

const service = new QrCodeService();

export class QrCodeController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = validateQrCreation.safeParse(req.body);

            if (!parsed.success) {
                throw new Error("Invalid Schema")
            }

            const qr = await service.create(parsed.data);
            return res.status(200).json({
                success: true,
                data: qr
            })
        }
        catch (err) {
            next(err);
        }
    }

    async verify(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.params.token;

            if (typeof token !== "string") {
                throw new Error("Invalid token")
            }
            const qrData = service.verifyQr(token);

            if (!qrData) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid or expired QR code"
                })
            }

            return res.status(200).json({
                success: true,
                data: qrData
            })
        }
        catch (err) {
            next(err);
        }
    }
}