import { client } from "@workspace/db/index"
import jwt, { JwtPayload } from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {

    const body = await req.json();
    const { classId, rollNum } = body;
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("bearer")) return NextResponse.json({
        message: "Missing token",
    }, { status: 401 })

    const token = authHeader.split(" ")[1] as string;
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!user || user.role !== "teacher") return NextResponse.json({
        message: "Unauthorized access"
    }, { status: 403 })

    try {

        const class_updation = await client.student.update({
            where: {
                rollNum,
            },
            data: {
                classId
            }
        })

        return NextResponse.json({
            message: "Added to class successfully"
        }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({
            message: "Unable to add in class"
        }, { status: 500 })
    }
}