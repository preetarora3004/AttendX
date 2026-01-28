import { client } from "@workspace/db/index"
import { NextRequest, NextResponse } from "next/server"
import jwt, { JwtPayload } from 'jsonwebtoken'

export async function POST(req: NextRequest) {

    const body = await req.json();
    const { teacherId, dept } = body;
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("bearer")) return NextResponse.json({
        message: "Missing token"
    }, { status: 401 })

    const token = authHeader.split(" ")[1];
    const user = jwt.verify(token as string, process.env.SECRET as string) as JwtPayload;

    if (user && user.id) {

        try {
            const teacher = await client.teacher.create({
                data: {
                    teacherId,
                    dept,
                    userId: user.id
                }
            })

            return NextResponse.json({
                message: "Enrolled successfully",
                teacher
            }, { status: 200 })
        }
        catch (err) {
            return NextResponse.json({
                message: "unable to register"
            }, { status: 500 })
        }
    }
    else {
        return NextResponse.json({
            message: "Invalid token"
        }, { status: 401 })
    }
}
