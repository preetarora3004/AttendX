import { client } from "@workspace/db/index"
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken'

export async function POST(req: NextRequest) {

    const body = await req.json();
    const { rollNum, course, classId } = body;
    const authHeader = req.headers.get("authorization")

    if (!authHeader?.startsWith("bearer")) return NextResponse.json({
        message: "Missing Token"
    }, { status: 401 })

    const token = authHeader.split(" ")[1];
    const user = jwt.verify(token as string, process.env.secret as string) as JwtPayload

    if (user) {

        try {
            const student = await client.student.create({
                data: {
                    rollNum,
                    course,
                    classId,
                    userId: user.id
                }
            })

            return NextResponse.json({
                message: "Student registeration successfull",
                student
            }, { status: 200 });
        }
        catch (err) {
            return NextResponse.json({
                error: `${err}`
            }, { status: 500 })
        }
    }
    else {
        return NextResponse.json({
            message: "Token invalid",
        }, { status: 401 })
    }
}