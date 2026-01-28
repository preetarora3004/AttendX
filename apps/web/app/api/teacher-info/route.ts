import { client } from "@workspace/db/index";
import { NextResponse, NextRequest } from "next/server"

export async function GET(req: NextRequest) {

    const body = await req.json();
    const { name } = body;

    try {
        const teacher = await client.user.findFirst({
            where: {
                name,
                role: "teacher"
            },
            include: {
                teacher: true
            }
        });

        if (!teacher) return NextResponse.json({
            message: "Search different name"
        }, { status: 404 });

        return NextResponse.json({
            teacher
        }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({
            message: "Unable to process request"
        }, { status: 500 });
    }
}