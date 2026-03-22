import { AttendanceRepository } from "@workspace/backend/modules/attendance/attendance.repository"
import { EventAttendance, ClassAttendance } from "@workspace/backend/modules/attendance/attendance.types"

export class AttendanceService {
    private repo = new AttendanceRepository();

    async markPresentClass(data: ClassAttendance) {
        return await this.repo.markPresent(data);
    }

    async markAbsentClass(data: ClassAttendance) {
        return await this.repo.markAbsent(data);
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
}

