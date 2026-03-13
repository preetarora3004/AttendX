import { create } from 'zustand'

type authPage = {
    SignIn: boolean,
    setSignIn: (value: boolean) => void

    role: "teacher" | "student" | null,
    setRole: (value: "teacher" | "student") => void

    user: {
        id: string,
        username: string,
        student: {
            id: string
            rollNum: string,
            class: string,
            createdAt: Date,
            course: string
        }
    } | null

    setUser: () => Promise<void>
}

export const store = create<authPage>((set) => ({
    SignIn: false,
    setSignIn: (value: boolean) => set({ SignIn: value }),

    role: null,
    setRole: (value: "teacher" | "student") => set({ role: value }),

    user: null,
    setUser: async () => {

        const res = await fetch("http://localhost:3000/api/student/get-student", { method: "GET" });
        const data = await res.json();

        set({ user: data });
    }
}))