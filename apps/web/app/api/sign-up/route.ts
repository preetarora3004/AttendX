import { client } from "@workspace/db/index"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const body = await req.json();
    const { username, password, name, role } = body;

    try {

        const existingUser = await client.user.findUnique({
            where: {
                username,
                password
            }
        })

        if (existingUser) return NextResponse.json({
            message: "User already exist"
        }, {status: 400})

        const user = await client.user.create({
            data: {
                username,
                password,
                name,
                role
            }
        })

        return NextResponse.json({
            message: "User created successfully",
            user
        },{status: 200});
    }
    catch (err) {
        return NextResponse.json({
            message: "Unable to create user",
        }, {status : 500})
    }
}