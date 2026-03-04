import { z } from "zod"

export const studentSchema = z.object({
    rollNum: z.number(),
    course: z.string(),
    userId: z.string()
})

export const viewAttendanceSchema = z.object({
    subjectId: z.string(),
    studentId: z.string()
})

export const markAttendanceSchema = z.object({
    studentId: z.string(),
    lectureId: z.string()
})

export const joinEventSchema = z.object({
    userId: z.string(),
    eventId: z.string()
})