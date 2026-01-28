import { client } from "@workspace/db/index"
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

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
        }, { status: 400 })

        const user = await client.user.create({
            data: {
                username,
                password,
                name,
                role
            }
        })

        const token = jwt.sign({

            id: user.id,
            username: user.username,
            role: user.role

        }, process.env.JWT_SECRET as string);

        return NextResponse.json({
            message: "User created successfully",
            token
        }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({
            message: "Unable to create user",
        }, { status: 500 })
    }
}