import { client } from "@workspace/db/index"

export class StudentRepository {

    async createStudent(data: {
        rollNum: number,
        userId: string,
        course: string
    }) {
        return client.student.create({ data })
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