import { client } from "@workspace/db/index";
import jwt, { JwtPayload } from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const body = await req.json();
    const { class_name } = body;
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("bearer")) return NextResponse.json({
        message: "Invalid token"
    }, { status: 401 });

    const token = authHeader.split(" ")[1] as string;
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!user || !(user.role === 'teacher')) return NextResponse.json({
        message: "Unauthorized access"
    }, { status: 403 });

    try {
        const studentList = await client.class.findUnique({
            where: {
                name: class_name
            },
            include: {
                students: true
            }
        });

        if (!studentList) return NextResponse.json({
            message: "Invalid class name"
        }, { status: 404 });

        return NextResponse.json({
            studentList
        }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({
            message: "Unable to execute process"
        }, { status: 500 });
    }
}