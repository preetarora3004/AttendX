export interface CreateStudentDTO {
    rollNum: number,
    course: string,
    userId: string,
    classId?: string,
    eventId?: string,
}

export interface JoinEventSchema {
    userId: string,
    eventId: string
}