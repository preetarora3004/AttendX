import { client } from "@workspace/db/index"

export class AttendanceRepository {
    async markPresent(data: {
        studentId: string,
        lectureId: string
    }) {
        const payload = {
            ...data
        }
        return await client.attendance.create({
            data: {
                lectureId: payload.lectureId,
                studentId: payload.studentId,
                status : "PRESENT"
            }
        })
    }

    async markEventPresent(data : {
        studentId: string,
        eventId: string
    }) {
        const payload = {
            ...data
        }
        return await client.eventAttendance.create({
            data: {
                studentId: payload.studentId,
                eventId: payload.eventId,
                status: "PRESENT"
            }
        })
    }

    async markAbsent(data: {
        studentId: string,
        lectureId: string
    }) {
        return await client.attendance.create({data})
    }

    async markEventAbsent(data: {
        studentId: string,
        eventId: string
    }) {
        return await client.eventAttendance.create({data})
    }

    /**
     * 
     * @param {subjectId}
     * @returns {Array}
     */

    async getAttendance(subjectId: string) {
        return await client.lecture.findFirst({
            where: {
                subjectId
            },
            include : {
                attendance: true
            }
        })
    }
}