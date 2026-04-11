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

type EnrollStudents = {
    id: string,
    student: {
        id: string,
        rollNum: string
    }
}

type EnrollSubject = {
    subject: {
        id: string
        name: string,
        courseCode: string,
        enrolledSubjects: Array<EnrollStudents>
    }
}

type Subject = {
    id: string,
    name: string,
    courseCode: string
}

type Class = {
    id: string
    name: string
}

type StudentName = {
    rollNum: string
    user: {
        name: string
    }
}

type authPage = {
    SignIn: boolean,
    setSignIn: (value: boolean) => void

    user: {
        id: string,
        name: string,
        username: string,
    } | null
    setUser: (token: string) => Promise<void>

    role: "TEACHER" | "STUDENT" | null,
    setRole: (value: "TEACHER" | "STUDENT") => void

    student: {
        id: string
        rollNum: string,
        createdAt: Date,
        course: string,
        enrolledSubjects: Array<EnrollSubject> | null
    } | null

    enrollSubjects: Array<EnrollSubject> | null

    class: {
        name: string
    } | null

    timeTable: Array<TimetableItem> | null

    teacherEnolledClass: Array<Class> | null

    teacherEnrolledSubject: Array<Subject> | null

    classList: {
        id: string,
        name: string,
        students: Array<StudentName>
    }[] | null

    teacher: {
        teacherId: number,
        dept: string,
        office: string,
        createdAt: Date,
        qualification: string
    } | null

    setTeacher: (token: string) => Promise<void>

    teacherDash : {
        id: string;
        name: string;
        teacher: {
            id: string;
            classes: {
                id: string;
                name: string;
                students: {
                    id: string;
                    rollNum: number;
                    enrolledSubjects: {
                        id: string;
                        subject: {
                            id: string;
                            name: string;
                            courseCode: string;
                        };
                    }[];
                }[];
                weeklyTimeTable: {
                    day: string;
                    periods: {
                        id: string;
                        startTime: string | Date;
                        subject: {
                            name: string;
                            courseCode: string;
                        };
                        teacher: {
                            id: string;
                        };
                    }[];
                }[];
            }[];
        } | null;
    } | null;
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
        console.log(data.data.user)
        set({ user: data.data.user })
        set({ enrollSubjects: data.data.user.student.enrolledSubjects })
        set({ timeTable: data.data.user.student.class.weeklyTimeTable })
        set({ class: data.data.user.student.class })
        set({ student: data.data.user.student })
    },

    role: null,
    setRole: (value: "TEACHER" | "STUDENT") => set({ role: value }),


    teacher: null,
    classList: null,
    teacherEnolledClass: null,
    teacherEnrolledSubject: null,
    teacherDash: null,

    setTeacher: async (token: string) => {
        const res = await fetch("http://localhost:3000/api/teacher/get-teacher/dashboard", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })

        const data = await res.json();
        console.log(data);
        set({ teacherDash: data.dashboard })
        set({ user: data.dashboard });
        set({ teacher: data.dashboard.teacher });
        set({ teacherEnolledClass: data.dashboard.teacher.classes });
        set({ teacherEnrolledSubject: data.dashboard.teacher.subjects });
        set({ classList: data.dashboard.teacher.classes })
    }

}))