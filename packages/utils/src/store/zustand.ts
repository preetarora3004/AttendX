import { create } from 'zustand'

type Period = {
  id: string;
  subject: {
    id: string;
    name: string;
  };
  startTime: string;
  teacher: {
    user: {
      name: string;
    };
  };
};

type TimetableItem = {
  id: string;
  day: string;
  periods: Period[];
};

type EnrollSubject = {
    subject: {
        id: string
        name: string,
        courseCode: string
    }
}

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
        createdAt: Date,
        course: string,
        enrolledSubjects : Array<EnrollSubject> | null 
    } | null

    enrollSubjects : Array<EnrollSubject> | null

    class: {
        name: string
    } | null

    timeTable: Array<TimetableItem> | null,

    teacher: {
        id: string,
        teacherId: number,
        dept: string,
        office: string,
        createdAt: Date,
        qualification: string
        subjects: Array<object>
        classes: Array<object>
    } | null

    setTeacher: (token: string) => Promise<void>
}

export const store = create<authPage>((set) => ({
    SignIn: false,
    setSignIn: (value: boolean) => set({ SignIn: value }),

    user: null,
    timeTable: null,
    class: null,
    student: null,
    enrollSubjects: null,

    setUser: async (token: string) => {
        const res = await fetch("http://localhost:3000/api/student-dashboard", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })

        const data = await res.json();
        console.log(data.data.user.student.enrolledSubjects);
        set({ user: data.data.user })
        set({ enrollSubjects : data.data.user.student.enrolledSubjects })
        set({ timeTable: data.data.user.student.class.weeklyTimeTable })
        set({ class: data.data.user.student.class })
        set({ student: data.data.user.student })
    },

    role: null,
    setRole: (value: "TEACHER" | "STUDENT") => set({ role: value }),


    teacher: null,
    setTeacher: async (token: string) => {
        const res = await fetch("http://localhost:3000/api/teacher/get-teacher", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })

        const data = await res.json();
        set({ teacher: data.data });
    }
}))