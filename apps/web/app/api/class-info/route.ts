import { client } from "@workspace/db/index"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {

    const body = await req.json();
    const { name } = body;

    try {

        const classInfo = await client.class.findUnique({
            where: {
                name
            },
            include: {
                students: false
            }
        });

        if (!classInfo) return NextResponse.json({
            message: "Class doesn't exist"
        }, { status: 404 });

        return NextResponse.json({
            classInfo
        }, { status: 200 });

    }
    catch (err) {
        return NextResponse.json({
            message: "Request failed"
        }, { status: 500 })
    }
}