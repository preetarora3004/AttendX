export interface Teacher {
    id: string
    name: string
    email: string
    phone: string
    department: string
    subject: string
    joinDate: string
    officeRoom: string
}

export interface Class {
    id: string
    name: string
    code: string
    students: string[]
    schedule: string
    room: string
    color: string
}

export interface Lecture {
    id: string
    classId: string
    lectureId: string
    qrCode: string
    date: string
    time: string
    attendance: number
}

export interface Event {
    id: string
    title: string
    date: string
    time: string
    description: string
    type: 'exam' | 'assignment' | 'seminar' | 'other'
}