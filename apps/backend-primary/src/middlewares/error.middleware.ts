import { Response, Request, NextFunction } from "express";

export async function errorMiddleware(
    error : any,
    req: Request,
    res: Response,
    next: NextFunction
) {

    return res.status(500).json({
        success: false,
        error: "Internal server error"
    })
}