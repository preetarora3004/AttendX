import { client } from "@workspace/db/index"
import { NextRequest, NextResponse } from "next/server"
import jwt, { JwtPayload } from "jsonwebtoken"

export async function POST(req: NextRequest, { params }: { params: { teacherId: string } }) {

    const body = await req.json();
    const { name, total_strength } = body;
    const teacherId = params.teacherId;

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("bearer")) return NextResponse.json({
        msg: "Missing token"
    }, { status: 401 });

    const token = authHeader.split(" ")[1] as string;
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!user || user.role !== 'teacher') return NextResponse.json({
        message: "User not authorized"
    }, { status: 403 })

    try {
        const existingClass = await client.class.findUnique({
            where: {
                name
            }
        })

        if (existingClass) return NextResponse.json({
            message: "Class already exist"
        }, { status: 400 });

        const classRoom = await client.class.create({
            data: {
                name,
                total_strength,
                teacherId
            }
        })

        return NextResponse.json({
            message: "Class created successfully",
            classRoom,
        }, { status: 200 })

    }
    catch (err) {
        return NextResponse.json({
            err
        }, { status: 500 })
    }
}