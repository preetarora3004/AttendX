export interface CreateStudentDTO {
    rollNum: number,
    course: string,
    userId: string,
}

export interface GetAttendance {
    subjectId: string,
    studentId: string
}

export interface AttendanceMarkSchema {
    studentId: string,
    lectureId: string
}

export interface JoinEventSchema {
    userId: string,
    eventId: string
}