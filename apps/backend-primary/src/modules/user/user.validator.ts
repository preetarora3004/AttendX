import { z } from "zod";

export const createUserSchema = z.object({
    name : z.string().min(2),
    username : z.email(),
    password : z.string().min(8),
    role : z.enum(["TEACHER", "STUDENT"])
})

export const credentialSchema = z.object({
    username: z.string(),
    password: z.string()
})