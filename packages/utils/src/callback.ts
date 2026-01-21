import { CallbacksOptions } from "next-auth";
import {JWT} from 'next-auth/jwt'

export const callbacks: Partial<CallbacksOptions> = {

    async jwt({ token, user }) : Promise<JWT>{

        if (user) {

            return {
                ...token,
                sub : user.id,
                username : user.username
            }
        }

        return token;
    },

    async session({session, user}){

        if(!session.user || !user) return session;

        session.user.id = user.id,
        session.user.username = user.username

        return session;
    }
}