export interface CreateUserDTO {
    name: string,
    username: string,
    password: string,
    role: "TEACHER" | "STUDENT"
}

export interface UserCredential {
    username: string,
    password: string
}

export interface PublicUser {
    id: string,
    username: string,
    role: "TEACHER" | "STUDENT"
}