import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from "next-auth/jwt"

declare module 'next-auth' {

    interface User extends DefaultUser {
        id: string | undefined
        username: string | undefined
    }

    interface Session {
        user: {
            id: string | undefined,
            username: string | undefined

        } & DefaultSession["user"]
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        sub: string | undefined,
        username: string | undefined,
        name?: string | undefined,
        email?: string | undefined,
        picture?: string | undefined
    }
}