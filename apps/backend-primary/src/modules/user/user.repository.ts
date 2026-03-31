import { client } from "@workspace/db/index"

export class UserRepository {
    async create(data: {
        username: string,
        password: string,
        name: string,
        role: "TEACHER" | "STUDENT"
    }) {
        return client.user.create({ data });
    }

    async findByCredentials(data: {
        username: string
    }) {
        return client.user.findFirst({
            where: {
                username: data.username
            }
        })
    }

    async findByUsername(username: string) {
        return client.user.findUnique({
            where: {
                username
            }
        })
    }

    async getStudentDashboard(userId: string) {
        return client.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                username: true,
                student: {
                    select: {
                        id: true,
                        rollNum: true,
                        course: true,
                        enrolledSubjects: {
                            select : {
                                subject: {
                                    select : {
                                        id: true,
                                        name: true,
                                        courseCode: true
                                    }
                                }
                            }
                        },
                        createdAt: true,
                        class: {
                            select: {
                                name: true,
                                weeklyTimeTable: {
                                    orderBy: { day: "asc" },
                                    select: {
                                        id: true,
                                        day: true,
                                        periods: {
                                            select: {
                                                id: true,
                                                subject: {
                                                    select: {
                                                        id: true,
                                                        name: true,
                                                    }
                                                },
                                                startTime: true,
                                                teacher: {
                                                    select: {
                                                        id: true,
                                                        user: {
                                                            select: {
                                                                name: true
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }
}