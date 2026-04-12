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

    async markAbsentForLecture(lectureId: string) {
        const lecture = await client.lecture.findUnique({
            where: { id: lectureId },
            select: { id: true, subjectId: true }
        })

        if (!lecture) {
            return null
        }

        const enrolledStudents = await client.enrolledSubject.findMany({
            where: { subjectId: lecture.subjectId },
            select: { studentId: true }
        })

        if (enrolledStudents.length === 0) {
            return { createdCount: 0 }
        }

        const attendanceRecords = enrolledStudents.map((student) => ({
            lectureId: lecture.id,
            studentId: student.studentId,
            status: 'ABSENT' as const
        }))

        const result = await client.attendance.createMany({
            data: attendanceRecords,
            skipDuplicates: true,
        })

        return {
            lectureId: lecture.id,
            createdCount: result.count,
        }
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
        return await client.lecture.findMany({
            where: {
                subjectId
            },
            orderBy: {
                date: 'asc'
            },
            include : {
                attendance: true
            }
        })
    }
}