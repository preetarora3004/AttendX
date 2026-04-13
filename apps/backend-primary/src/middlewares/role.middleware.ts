import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

export async function authorizeRole(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization?.split(" ")[1] as string;

    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Invalid token"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        if (decoded.role !== "TEACHER") {
            return res.status(401).json({
                success: false,
                error: "Unauthorized access"
            })
        }
        req.user = decoded
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            error: "teacher does not exists"
        })
    }
}
