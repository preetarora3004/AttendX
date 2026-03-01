import { NextFunction, Request, Response } from "express";
import { UserService } from "@workspace/backend/modules/user/user.service";
import { createUserSchema, credentialSchema } from "@workspace/backend/modules/user/user.validator";

const service = new UserService();

export class UserController {

    async create(req: Request, res: Response, next: NextFunction) {

        try {
            const parsed = createUserSchema.safeParse(req.body);

            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: parsed.error
                })
            }

            const user = await service.createUser(parsed.data);
            const token = service.jwtCreation(user);

            return res.status(201).json({
                success: true,
                data: token
            })
        }
        catch (err) {
            next(err);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {

        const user = await service.getUser(req.params.id as string);
        return res.status(201).json({
            success: true,
            data: user
        })
    }

    async getByCredentials(req: Request, res: Response, next: NextFunction) {

        try {
            const parsed = credentialSchema.safeParse(req.body);

            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: parsed.error
                })
            }
            const user = await service.getUserByCredentials(parsed.data)
            const token = service.jwtCreation(user);

            return res.status(200).json({
                success: true,
                data: token
            })
        }
        catch (err) {
            next(err);
        }
    }
}