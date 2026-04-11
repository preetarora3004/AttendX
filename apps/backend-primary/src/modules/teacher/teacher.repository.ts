import { client } from "@workspace/db/index"

export class TeacherRepository {

    async createTeacher(data: {
        userId: string,
        teacherId: number,
        dept: string,
        qualification: string,
        office: string
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

    // async createTimeTable(data: {
    //     day: string,
    //     startTime: Date,
    //     endTime: Date,
    //     classId: string,
    //     subjectId: string
    // }) {
    //     return client.weeklyTimeTable.create({ data })
    // }

    async getTeacherDashboard(userId: string) {
        return await client.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                username: true,
                teacher: {
                    select: {
                        id: true,
                        teacherId: true,
                        qualification: true,
                        office: true,
                        createdAt: true,
                        subjects: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        classes: {
                            select: {
                                id: true,
                                name: true,

                                students: {
                                    select: {
                                        id: true,
                                        rollNum: true,
                                        enrolledSubjects: {
                                            select: {
                                                id: true,
                                                subject: {
                                                    select: {
                                                        id: true,
                                                        name: true,
                                                        courseCode: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                weeklyTimeTable: {
                                    select: {
                                        day: true,

                                        periods: {
                                            select: {
                                                id: true,
                                                startTime: true,

                                                subject: {
                                                    select: {
                                                        name: true,
                                                        courseCode: true,
                                                    },
                                                },

                                                teacher: {
                                                    select: {
                                                        id: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
}

