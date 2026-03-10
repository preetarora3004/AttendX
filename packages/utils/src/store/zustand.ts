import { create } from 'zustand'

type authPage = {
    SignIn: boolean,
    setSignIn: (value: boolean) => void

    role : "teacher" | "student" | null,
    setRole : (value: "teacher" | "student") => void
}

export const store = create<authPage>((set) => ({
    SignIn: false,
    setSignIn: (value: boolean) => set({ SignIn: value }),

    role: null,
    setRole: (value : "teacher" | "student") => set({role : value})
}))