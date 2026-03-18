import { client } from "@workspace/db/index"

export class StudentRepository {

    async createStudent(data: {
        rollNum: number,
        userId: string,
        course: string
    }) {
        return client.student.create({ data })
    }

    async getAttendance(data: {
        subjectId: string,
        studentId: string
    }) {
        return client.attendance.count({
            where: {
                studentId: data.studentId,
                status: "PRESENT",
                lecture: {
                    subjectId: data.subjectId
                }
            }
        })
    }

    async getStudentByUserId(userId: string) {
        return client.student.findUnique({
            where: {
                userId
            }
        })
    }

    async getTimeTableByUserId(userId: string) {
        return client.student.findUnique({
            where: {
                userId
            },
            include: {
                class: {
                    include: {
                        timetable: {
                            include : {
                                subject: true
                            }
                        }
                    }
                },
            }
        })
    }

    async markAttendanceByLectureId(data: {
        studentId: string,
        lectureId: string
    }) {
        return client.attendance.create({
            data: {
                studentId: data.studentId,
                lectureId: data.lectureId,
                status: "PRESENT"
            }
        })
    }

    async getTimeTableByName(name: string) {
        return client.class.findUnique({
            where: { name },
            select: {
                timetable: true
            }
        })
    }

    async joinEventByEventId(data: {
        userId: string,
        eventId: string
    }) {
        return client.student.update({
            where: { userId: data.userId },
            data: {
                event: {
                    connect: { id: data.eventId }
                }
            }
        })
    }
}