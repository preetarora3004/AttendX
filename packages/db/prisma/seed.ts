import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, Day } from "@prisma/client";
import bcrypt from "bcrypt";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

async function main() {
    console.log("Seeding started...");

    const teachers = await Promise.all(
        Array.from({ length: 3 }).map(async (_, i) => {
            const hashedPassword = await hashPassword("password");

            return prisma.user.create({
                data: {
                    username: `teacher${i + 1}`,
                    password: hashedPassword,
                    name: `Teacher ${i + 1}`,
                    role: Role.TEACHER,
                    teacher: {
                        create: {
                            teacherId: i + 1,
                            dept: "CSE",
                            qualification: "M.Tech",
                            office: `Room ${i + 101}`,
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

    const studentPassword = await hashPassword("password");

    const studentUser = await prisma.user.create({
        data: {
            username: "student1",
            password: studentPassword,
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
        { name: "Database Management Systems", code: "CSE203" },
        { name: "Computer Networks", code: "CSE204" },
        { name: "Software Engineering", code: "CSE205" },
        { name: "Theory of Computation", code: "CSE206" },
        { name: "Artificial Intelligence", code: "CSE207" },
        { name: "Competitive Coding", code : "AEC121"}
    ];

    const subjects = await Promise.all(
        subjectList.map((sub, i) =>
            prisma.subject.create({
                data: {
                    name: sub.name,
                    courseCode: sub.code,
                    teacherId: teachers[i % 3]!.teacher!.id,
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

    for (const day of days) {
        const timetable = await prisma.weeklyTimeTable.create({
            data: {
                day,
                classId: classData.id,
            },
        });

        const shuffledSubjects = [...subjects].sort(
            () => 0.5 - Math.random()
        );

        for (let i = 0; i < 2; i++) {
            const subject = shuffledSubjects[i];

            const teacher = teachers.find(
                (t) => t.teacher!.id === subject!.teacherId
            )!.teacher!;

            await prisma.period.create({
                data: {
                    subjectId: subject!.id,
                    teacherId: teacher.id,
                    weeklyTimeTableId: timetable.id,
                    startTime: new Date(2025, 0, 1, 9 + i, 0, 0),
                },
            });
        }
    }

    console.log("Seeding completed");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
