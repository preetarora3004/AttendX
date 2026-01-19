import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "@workspace/db/index";
import jwt from 'jsonwebtoken';

export const providers = [

    CredentialsProvider({
        credentials: {
            username: {
                type: "username",
                label: "username",
                placeholder: "Enter your username"
            },
            password: {
                type: "password",
                label: "password",
                placeholder: "***"
            }
        },

        authorize: async (credentials: Record<"username" | "password", string> | undefined) => {

            const { username, password } = credentials ?? {}

            if (!username || !password) return null;

            const user = await client.user.findUnique({
                where: {
                    username: username,
                    password: password
                }
            })

            if (!user) return null;

            const token = jwt.sign({
                id: user.id,
                username: user.username
            }, process.env.NEXTAUTH_SECRET!)

            return {
                id : user.id,
                username : user.username,
                token 
            }
        }
    })

]