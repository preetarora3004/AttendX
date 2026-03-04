-- DropIndex
DROP INDEX "Attendance_lectureId_idx";

-- DropIndex
DROP INDEX "Lecture_subjectId_idx";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "eventId" TEXT;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
