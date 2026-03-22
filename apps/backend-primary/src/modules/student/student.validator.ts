import { z } from "zod"

export const studentSchema = z.object({
    rollNum: z.number(),
    course: z.string(),
    userId: z.string(),

    classId: z.string().optional(),
    eventId: z.string().optional()
})

export const joinEventSchema = z.object({
    userId: z.string(),
    eventId: z.string()
})