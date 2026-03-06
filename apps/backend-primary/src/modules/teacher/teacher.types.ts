export interface QrGenerationSchema {
    lectureId: string
}

export interface ClassSchema {
    name: string,
    teacherId: string
}

export interface SubjectSchema {
    name: string,
    courseCode: string,
    teacherId: string,
}

export interface LectureSchema {
    subjectId: string
}

export interface EventSchema {
    name: string,
    startDate: Date,
    endDate: Date
}

export interface ClassTimeTableSchema {
    day: string,
    startTime: Date,
    endTime: Date,
    classId: string,
    subjectId: string
}