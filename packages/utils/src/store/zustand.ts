import { create } from 'zustand'

type authPage = {
    SignIn: boolean,
    setSignIn: (value: boolean) => void

    user: {
        id: string,
        name: string,
        username: string,
        role: string
    } | null
    setUser: (token: string) => Promise<void>

    role: "TEACHER" | "STUDENT" | null,
    setRole: (value: "TEACHER" | "STUDENT") => void

    student: {
        id: string
        rollNum: string,
        class: string,
        createdAt: Date,
        course: string
    } | null

    setStudent: (token: string) => Promise<void>

    timeTable: Array<string> | null,
    setTimeTable: (token: string) => Promise<void>
}

export const store = create<authPage>((set) => ({
    SignIn: false,
    setSignIn: (value: boolean) => set({ SignIn: value }),

    user: null,
    setUser: async (token: string) => {
        const res = await fetch("http://localhost:3000/api/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })

        const data = await res.json();
        set({ user: data.data })
    },

    role: null,
    setRole: (value: "TEACHER" | "STUDENT") => set({ role: value }),

    student: null,
    setStudent: async (token: string) => {

        const res = await fetch("http://localhost:3000/api/student/get-student", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();

        set({ student: data.data });
    },

    timeTable: null,
    setTimeTable: async (token: string) => {

        const res = await fetch("http://localhost:3000/api/student/timeTable", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })

        const data = await res.json();

        set({ timeTable: data.data.class.timeTable })
    }
}))