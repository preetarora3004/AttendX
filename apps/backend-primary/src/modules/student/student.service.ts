import { StudentRepository } from "@workspace/backend/modules/student/student.repository";
import {
    CreateStudentDTO,
    JoinEventSchema
} from "@workspace/backend/modules/student/student.types";

export class StudentService {
    private repo = new StudentRepository();

    async createStudent(data: CreateStudentDTO) {
        // const isStudent = await this.getStudent(data.userId);

        // if(isStudent) {
        //     throw new Error("Student Exists");
        // }

        const student = await this.repo.createStudent(data);

        if (!student) {
            throw new Error("Unable to create student")
        }

        return student;
    }

    async getTimeTableByUserId(userId: string) {
        const timeTable = await this.repo.getTimeTableByUserId(userId);

        if(!timeTable) {
            throw new Error("TimeTable not exists")
        }

        return timeTable;
    }

    async getStudent(userId: string) {
        const student = await this.repo.getStudentByUserId(userId);

        if (!student) {
            throw new Error("Student not exists")
        }
        return student;
    }

    async getTimeTable(name: string) {
        const classInfo = await this.repo.getTimeTableByName(name);

        if (!classInfo) {
            throw new Error("Invalid class name")
        }
        return classInfo.timetable;
    }

    async joinEvent(data: JoinEventSchema) {
        const student = await this.repo.joinEventByEventId(data);

        if (!student.eventId) {
            throw new Error("Invalid event name")
        }
        return true;
    }
}