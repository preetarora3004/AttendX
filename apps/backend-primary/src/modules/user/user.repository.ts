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
        username: string,
        password: string
    }) {
        return client.user.findFirst({
            where: {
                username: data.username,
                password: data.password
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

    async findById(userId: string) {
        return client.user.findUnique({
            where: { id: userId }
        })
    }
}