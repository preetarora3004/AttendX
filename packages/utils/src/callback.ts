import { CallbacksOptions } from "next-auth";
import { JWT } from 'next-auth/jwt'
import { DefaultSession, Session } from "next-auth";

export const callbacks: Partial<CallbacksOptions> = {

    async jwt({ token, user }): Promise<JWT> {

        if (user) {

            return {
                ...token,
                id: user.id,
                username: user.username
            }
        }

        return token;
    },

    async session({ session, user }): Promise<Session | DefaultSession> {

        if (session.user || session) {
            return {
                ...session,
                user : {
                    id : user.id,
                    username : user.username
                }
            }
        }

        return session;
    }
}