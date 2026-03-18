import { client } from "@workspace/db/index"

export class TeacherRepository {

    async getTeacherByUserId (userId: string) {
        return client.teacher.findUnique({
            where: {userId}
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

