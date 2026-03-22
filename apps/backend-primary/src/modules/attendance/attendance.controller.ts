import { AttendanceService } from "@workspace/backend/modules/attendance/attendance.service";
import { NextFunction, Request, Response } from "express";
import { classAttendance, eventAttendance } from "@workspace/backend/modules/attendance/attendance.validator";

const service = new AttendanceService();

export class AttendanceController {

    async markPresent(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = {
                lectureId: req.params.lectureId,
                studentId: req.params.studentId
            }

            const parsed = classAttendance.safeParse(payload);

            if (!parsed.success) {
                throw new Error("Invalid Scheme")
            }

            const markPresent = await service.markPresentClass(parsed.data);

            return res.status(201).json({
                success: true
            })
        }
        catch (err) {
            next(err)
        }
    }

    async markAbsent(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = {
                lectureId: req.params.lectureId,
                studentId: req.params.studentId
            }

            const parsed = classAttendance.safeParse(payload);

            if (!parsed.success) {
                throw new Error("Invalid Scheme")
            }

            const markAbsent = await service.markAbsentClass(parsed.data);

            return res.status(201).json({
                success: true
            })
        }
        catch (err) {
            next(err);
        }
    }

    async markEventPresent(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = {
                studentId: req.params.studentId,
                eventId: req.params.eventId
            }

            const parsed = eventAttendance.safeParse(payload)

            if (!parsed.success) {
                throw new Error("Invalid Schema")
            }

            const markPresentEvent = await service.markPresentEvent(parsed.data);

            return res.status(201).json({
                success: true
            })
        }
        catch (err) {
            next()
        }
    }

    async markEventAbsent(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = {
                studentId: req.params.studentId,
                eventId: req.params.eventId
            }

            const parsed = eventAttendance.safeParse(payload);

            if (!parsed.success) {
                throw new Error("Invalid Scheme")
            }

            const markAbsentEvent = await service.markAbsentEvent(parsed.data);

            return res.status(201).json({
                success: true
            })
        }
        catch (err) {
            next(err);
        }
    }

    async getAttendance(req: Request, res: Response, next: NextFunction) {
        try {
            const { subjectId } = req.body;

            if (!subjectId) {
                throw new Error("Invalid Schema");
            }

            const totalClass = await service.getAttendance(subjectId);

            if(!totalClass|| totalClass.attendance.length < 1) {
                return res.status(400).json({
                    success: false,
                    error: "Not exists"
                })
            }

            return res.status(200).json({
                success: true,
                data: totalClass
            })
        }
        catch(err) {
            next(err);
        }
    }
}