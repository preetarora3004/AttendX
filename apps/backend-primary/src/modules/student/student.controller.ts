import { Request, Response, NextFunction } from "express";
import { StudentService } from "@workspace/backend/modules/student/student.service";
import { studentSchema, joinEventSchema } from "@workspace/backend/modules/student/student.validator";

const service = new StudentService();

export class StudentController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const payload = {
                ...req.body,
                course: req.body.dept,
                userId
            }

            const parsed = studentSchema.safeParse(payload);

            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid schema"
                })
            }
            const student = await service.createStudent(parsed.data);

            return res.status(201).json({
                success: true,
                data: student
            })
        }
        catch (err) {
            next(err);
        }
    }

    async getTimeTableByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const timeTable = await service.getTimeTableByUserId(userId);

            return res.status(200).json({
                success: true,
                data: timeTable
            })
        }
        catch (err) {
            next(err);
        }
    }


    async getStudent(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const student = await service.getStudent(userId);

            return res.status(200).json({
                success: true,
                data: student
            })
        }
        catch (err) {
            next(err);
        }
    }

    async getTimeTable(req: Request, res: Response, next: NextFunction) {
        try {
            const name = req.body;
            const timeTable = await service.getTimeTable(name);

            return res.status(200).json({
                success: true,
                data: timeTable
            })
        }
        catch (err) {
            next(err);
        }
    }

    async joinEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = {
                userId: req.user!.id as string,
                eventId: req.params.eventId
            }
            const parsed = joinEventSchema.safeParse(payload);

            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid schema"
                })
            }

            const joinEvent = await service.joinEvent(parsed.data);

            return res.status(200).json({
                success: true,
            })
        }
        catch (err) {
            next(err);
        }
    }
}