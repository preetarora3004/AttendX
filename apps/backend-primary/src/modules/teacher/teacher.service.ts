import { TeacherRepository } from "@workspace/backend/modules/teacher/teacher.repository";
import {Teacher, ClassSchema, SubjectSchema, LectureSchema, EventSchema, ClassTimeTableSchema } from "@workspace/backend/modules/teacher/teacher.types";

export class TeacherService {
    private repo = new TeacherRepository();

    async createTeacher(data: Teacher) {
        return await this.repo.createTeacher(data);
    }

    async getTeacherDashboard(userId: string) {
        return await this.repo.getTeacherDashboard(userId);
    }

    async getTeacherById(userId: string) {
        return await this.repo.getTeacherByUserId(userId);
    }

    async createClass(data: ClassSchema) {
        return await this.repo.createClass(data);
    }

    async createSubject(data: SubjectSchema) {
        return await this.repo.createSubject(data);
    }

    async createLecture(data: LectureSchema) {
        return await this.repo.createLecture(data.subjectId);
    }

    async createEvent(data: EventSchema) {
        return await this.repo.createEvent(data);
    }

    async createTimeTable(data: ClassTimeTableSchema) {
        return await this.repo.createTimeTable(data);
    } 
}
