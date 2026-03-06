import { Request, Response, NextFunction } from "express"
import { TeacherService } from "@workspace/backend/modules/teacher/teacher.service"
import { validateClassSchema, validateSubjectSchema, validateLectureSchema, validateEventSchema, validateClassTimeTableSchema } from "@workspace/backend/modules/teacher/teacher.validator"

const service = new TeacherService();

export class TeacherController {
    async createClass(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = validateClassSchema.safeParse(req.body);

            if (!parsed.success) {
                throw new Error("Invalid Schema")
            }
            const classCreation = await service.createClass(parsed.data);

            return res.status(200).json({
                success: true,
                data: {
                    id: classCreation.id,
                    name: classCreation.name
                }
            })
        }
        catch (err) {
            next(err);
        }
    }

    async createSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = validateSubjectSchema.safeParse(req.body)

            if (!parsed.success) {
                throw new Error("Invalid Schema")
            }

            const subject = await service.createSubject(parsed.data);

            return res.status(200).json({
                success: true,
                data: {
                    id: subject.id,
                    name: subject.name
                }
            })
        }
        catch (err) {
            next(err);
        }
    }

    async createLecture(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = validateLectureSchema.safeParse(req.body);

            if (!parsed.success) {
                throw new Error("Invalid Schema")
            }
            const lecture = await service.createLecture(parsed.data);

            return res.status(200).json({
                success: true,
                data: {
                    id: lecture.id,
                    subjectId: lecture.subjectId
                }
            })
        }
        catch (err) {
            next(err);
        }
    }

    async createEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = validateEventSchema.safeParse(req.body);

            if (!parsed.data) {
                throw new Error("Invalid schema")
            }
            const event = await service.createEvent(parsed.data);

            return res.status(200).json({
                success: true,
                data: { event }
            })
        }
        catch (err) {
            next(err);
        }
    }

    async createTimeTable(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = validateClassTimeTableSchema.safeParse(req.body);

            if (!parsed.success) {
                throw new Error("Invalid schema")
            }
            const timeTable = await service.createTimeTable(parsed.data);

            return res.status(200).json({
                success: true,
                data: timeTable
            })

        }
        catch (err) {
            next(err);
        }
    }
}

