import { z } from "zod";

export const validateQrCreation = z.object({
    subjectId: z.string(),
    lectureId: z.string()
})