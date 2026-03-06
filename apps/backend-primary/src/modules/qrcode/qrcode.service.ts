import QRCode, { QRCodeOptions } from "qrcode";
import crypto from 'crypto'
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 15, checkperiod: 18 });

export class QrCodeService {
    async create(data: {
        lectureId: string,
        subjectId: string,
    }) {

        const token = crypto.randomBytes(16).toString("hex");
        const payload = {
            ...data,
            token
        }
        const option: Partial<QRCodeOptions> = {
            errorCorrectionLevel: "M",
        }

        const qrCode = await QRCode.toString(token, option);

        if (!qrCode) {
            return {
                success: false,
                err: "Unable to create QR"
            }
        }
        cache.set(token, payload);
        return qrCode;
    }

    async verifyQr(token: string) {

        if (!cache.has(token)) {
            return false;
        }

        return true;
    }
}