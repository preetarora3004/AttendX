import { z } from "zod"

export const createTeacherValidator = z.object({
    userId: z.string(),
    teacherId: z.number(),
    dept : z.string(),
    qualification : z.string(),
    office : z.string(),
})

export const validateQrGeneration = z.object({
    lectureId: z.string(),
})

export const validateClassSchema = z.object({
    name: z.string(),
    teacherId: z.string()
})

export const validateSubjectSchema = z.object({
    name: z.string(),
    courseCode: z.string(),
    teacherId: z.string()
})

export const validateLectureSchema = z.object({
    subjectId: z.string()
})

export const validateEventSchema = z.object({
    name: z.string(),
    startDate: z.date(),
    endDate: z.date()
})

export const validateClassTimeTableSchema = z.object({
    day: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    classId: z.string(),
    subjectId: z.string()
})