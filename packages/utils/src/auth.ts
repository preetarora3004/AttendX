import { NextAuthOptions } from "next-auth"
import { providers } from "@workspace/utils/provider"
import {callbacks} from "@workspace/utils/callback"

export const authOption: NextAuthOptions = {

    providers,
    callbacks
}