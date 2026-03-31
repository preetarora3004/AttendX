import { UserRepository } from "@workspace/backend/modules/user/user.repository";
import { CreateUserDTO, PublicUser, UserCredential } from "@workspace/backend/modules/user/user.types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class UserService {
    private repo = new UserRepository();

    async createUser(data: CreateUserDTO) {

        const existing = await this.repo.findByUsername(data.username);

        if (existing) {
            throw new Error("Username already exist");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.repo.create({
            ...data,
            password: hashedPassword
        })

        return {
            id: user.id,
            username: user.username,
            role: user.role
        }
    }

    async getUser(id: string) {

        const user = await this.repo.getStudentDashboard(id);

        if (!user) {
            throw new Error("User does not exist");
        }

        return {
            user
        }
    }

    async getUserByCredentials(data: UserCredential) {

        const user = await this.repo.findByCredentials(data);

        if(!user){
            throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(data.password, user?.password);
        console.log(isValid);
        console.log(data.password);

        if(!isValid){
            throw new Error("Invalid Password");
        }

        return {
            id: user.id,
            username: user.username,
            role: user.role
        }
    }

    jwtCreation(data: PublicUser) {

        const token = jwt.sign(data, process.env.JWT_SECRET!);
        return token;
    }
}