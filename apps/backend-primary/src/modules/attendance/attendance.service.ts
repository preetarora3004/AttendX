import { AttendanceRepository } from "@workspace/backend/modules/attendance/attendance.repository"
import { EventAttendance, ClassAttendance } from "@workspace/backend/modules/attendance/attendance.types"
import { client } from "@workspace/db/index"

export class AttendanceService {
    private repo = new AttendanceRepository();

    async markPresentClass(data: ClassAttendance) {
        return await this.repo.markPresent(data);
    }

    async markAbsentClass(data: ClassAttendance) {
        return await this.repo.markAbsent(data);
    }

    async markAbsentForLecture(lectureId: string) {
        return await this.repo.markAbsentForLecture(lectureId);
    }

    async markPresentEvent(data: EventAttendance) {
        return await this.repo.markEventPresent(data);
    }

    async markAbsentEvent(data: EventAttendance) {
        return await this.repo.markEventAbsent(data);
    }

    async getAttendance(subjectId: string) {
        return await this.repo.getAttendance(subjectId);
    }

    async registerFaceDescriptor(studentId: string, faceEmbedding: number[]) {
        return await client.student.update({
            where: { id: studentId },
            data: { faceEmbedding }
        })
    }

    async verifyFaceDescriptor(studentId: string, faceEmbedding: number[]): Promise<boolean> {
        const student = await client.student.findUnique({
            where: { id: studentId },
            select: { faceEmbedding: true }
        })

        if (!student || !student.faceEmbedding) {
            return false
        }

        const storedEmbedding = Array.isArray(student.faceEmbedding)
            ? student.faceEmbedding
            : Object.values(student.faceEmbedding)

        return this.compareEmbeddings(faceEmbedding, storedEmbedding as number[])
    }

    async checkFaceRegistration(studentId: string): Promise<boolean> {
        const student = await client.student.findUnique({
            where: { id: studentId },
            select: { faceEmbedding: true }
        })

        return !!student?.faceEmbedding
    }

    private compareEmbeddings(embedding1: number[], embedding2: number[]): boolean {
        if (embedding1.length !== embedding2.length) {
            return false
        }

        let sum = 0
        for (let i = 0; i < embedding1.length; i++) {
            const diff = embedding1[i]! - embedding2[i]!
            sum += diff * diff
        }
        const distance = Math.sqrt(sum)
        return distance < 0.6
    }
}
