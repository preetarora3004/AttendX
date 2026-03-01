import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        (req as any).user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            error: "Invalid token"
        })
    }
}