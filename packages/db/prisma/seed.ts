import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, Day } from "@prisma/client";
import bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

async function main() {
  console.log("Seeding started...");

  const teachers = await Promise.all(
    Array.from({ length: 3 }).map(async (_, i) => {
      return prisma.user.create({
        data: {
          username: `teacher${i + 1}`,
          password: await hashPassword("password"),
          name: `Teacher ${i + 1}`,
          role: Role.TEACHER,
          teacher: {
            create: {
              teacherId: i + 1,
              dept: "CSE",
              qualification: "M.Tech",
              office: `Room ${101 + i}`,
            },
          },
        },
        include: { teacher: true },
      });
    })
  );

  const classData = await prisma.class.create({
    data: {
      name: "CSE-A",
      teacherId: teachers[0]!.teacher!.id,
      totalStrength: 1,
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      username: "student1",
      password: await hashPassword("password"),
      name: "Student One",
      role: Role.STUDENT,
      student: {
        create: {
          rollNum: 1,
          course: "B.Tech CSE",
          classId: classData.id,
        },
      },
    },
    include: { student: true },
  });

  const student = studentUser.student!;

  const subjectList = [
    { name: "Data Structures", code: "CSE201" },
    { name: "Operating Systems", code: "CSE202" },
    { name: "DBMS", code: "CSE203" },
    { name: "Computer Networks", code: "CSE204" },
    { name: "Software Engineering", code: "CSE205" },
    { name: "TOC", code: "CSE206" },
  ];

  const subjects = await Promise.all(
    subjectList.map((sub, i) =>
      prisma.subject.create({
        data: {
          name: sub.name,
          courseCode: sub.code,
          teacherId: teachers[i % teachers.length]!.teacher!.id,
        },
      })
    )
  );

  await Promise.all(
    subjects.map((subject) =>
      prisma.enrolledSubject.create({
        data: {
          studentId: student.id,
          subjectId: subject.id,
        },
      })
    )
  );

  const days = [
    Day.MONDAY,
    Day.TUESDAY,
    Day.WEDNESDAY,
    Day.THURSDAY,
  ];

  for (const [dayIndex, day] of days.entries()) {
    const timetable = await prisma.weeklyTimeTable.create({
      data: {
        day,
        classId: classData.id,
      },
    });

    for (let i = 0; i < 2; i++) {
      const subject = subjects[(dayIndex + i) % subjects.length];

      await prisma.period.create({
        data: {
          subjectId: subject!.id,
          teacherId: subject!.teacherId,
          weeklyTimeTableId: timetable.id,
          startTime: new Date(2026, 0, 1 + dayIndex, 9 + i, 0), 
        },
      });
    }
  }

  for (const teacherObj of teachers) {
    const teacher = teacherObj.teacher!;

    const teacherSubjects = subjects.filter(
      (s) => s.teacherId === teacher.id
    );

    if (teacherSubjects.length === 0) continue;

    for (const [dayIndex, day] of days.entries()) {
      const teacherTimeTable = await prisma.teacherTimeTable.create({
        data: {
          teacherId: teacher.id,
          day,
        },
      });

      for (let i = 0; i < 2; i++) {
        const subject =
          teacherSubjects[(dayIndex + i) % teacherSubjects.length];

        await prisma.teacherPeriod.create({
          data: {
            teacherId: teacher.id,
            teacherTimeTableId: teacherTimeTable.id,
            subjectId: subject!.id,
            time: new Date(2026, 0, 1 + dayIndex, 9 + i, 0),
            venue: `Room ${101 + i}`,
          },
        });
      }
    }
  }

  console.log("Seeding completed");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });