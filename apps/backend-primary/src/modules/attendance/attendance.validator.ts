import z from 'zod'

export const classAttendance = z.object({
    studentId: z.string(),
    lectureId: z.string()
})

export const eventAttendance = z.object({
    studentId: z.string(),
    eventId: z.string()
})

