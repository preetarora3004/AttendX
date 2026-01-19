import { NextAuthOptions } from "next-auth"
import { providers } from "@workspace/utils/provider"

export const authOption: NextAuthOptions = {

    providers,
}