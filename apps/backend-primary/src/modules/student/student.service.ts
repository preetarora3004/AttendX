import { StudentRepository } from "@workspace/backend/modules/student/student.repository";
import { CreateStudentDTO, GetAttendance, AttendanceMarkSchema,
    JoinEventSchema
 } from "@workspace/backend/modules/student/student.types";

export class StudentService {
    private repo = new StudentRepository();

    async createStudent(data: CreateStudentDTO) {
        const student = await this.repo.createStudent(data);

        if (!student) {
            throw new Error("Unable to create student")
        }

        return student;
    }

    async viewAttendance(data: GetAttendance) {
        const attendance = await this.repo.getAttendance(data);

        if (attendance.length() === 0) {
            throw new Error("No preview available")
        }
        return attendance;
    }

    async getStudent(userId: string) {
        const student = await this.repo.getStudentByUserId(userId);

        if (!student) {
            throw new Error("Student not exists")
        }
        return student;
    }

    async markAttendanceByStudent(data: AttendanceMarkSchema) {
        const attendance = await this.repo.markAttendanceByLectureId(data);

        if(!(attendance.status === "PRESENT")) {
            throw new Error("Invalid lecture")
        }
        return true
    }

    async getTimeTable(name: string) {
        const classInfo = await this.repo.getTimeTableByName(name);

        if(!classInfo) {
            throw new Error("Invalid class name")
        }
        return classInfo.timeTable;
    }

    async joinEvent(data: JoinEventSchema) {
        const student = await this.repo.joinEventByEventId(data);

        if(!student.eventId) {
            throw new Error("Invalid event name")
        }
        return true;
    }
}