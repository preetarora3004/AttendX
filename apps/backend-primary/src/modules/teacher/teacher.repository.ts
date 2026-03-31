import { client } from "@workspace/db/index"

export class TeacherRepository {

    async createTeacher(data: {
        userId: string,
        teacherId: number,
        dept: string,
        qualification: string,
        officeRoom: string
    }) {
        return client.teacher.create({ data })
    }

    async getTeacherByUserId(userId: string) {
        return client.teacher.findUnique({
            where: { userId },
            include: {
                subjects: true,
                classes: true
            }
        })
    }

    async createClass(data: {
        name: string,
        teacherId: string
    }) {
        return client.class.create({ data });
    }

    async createSubject(data: {
        name: string,
        courseCode: string,
        teacherId: string
    }) {
        return client.subject.create({ data });
    }

    async createLecture(subjectId: string) {
        return client.lecture.create({
            data: { subjectId }
        })
    }

    async createEvent(data: {
        name: string,
        startDate: Date,
        endDate: Date
    }) {
        return client.event.create({ data })
    }

    async createTimeTable(data: {
        day: string,
        startTime: Date,
        endTime: Date,
        classId: string,
        subjectId: string
    }) {
        return client.classTimetable.create({ data })
    }
}

