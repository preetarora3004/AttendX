import { useEffect } from "react";
import { SignIn } from "../signin/sign-in";
import { SignUp } from "../signup/sign-up";
import { store } from "@workspace/utils/store/zustand";

export function AuthPage() {

    const signIn = store((s) => s.SignIn)

    useEffect(() => {
        console.log(signIn);
    }, [signIn])

    return (
        <>
            {signIn ? <SignIn /> : <SignUp />}
        </>
    )
}