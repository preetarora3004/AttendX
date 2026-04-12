import { LogOut, BookOpen, Loader, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { store } from "@workspace/utils/store/zustand";
import { useShallow } from "zustand/shallow";
import QRScanner from "./components/qr-code";
import FaceRegistration from "./components/face-registration";
import { useNavigate } from "react-router";

// const BACKEND_URL = 'https://attendx-t48b.onrender.com'
const BACKEND_URL = 'http://localhost:3000'

interface LectureAttendance {
  id: string
  date: string
  attendance: Array<{
    studentId: string
    status: string
  }>
}

interface AttendanceStats {
  total: number
  present: number
  absent: number
  unmarked: number
  percentage: number
}

export function DashBoard() {

    const navigate = useNavigate();
    const [showQRScanner, setShowQRScanner] = useState(false)
    const { student, timeTable, user, setUser, classInfo, enrollSubject } =
        store(
            useShallow((s) => ({
                user: s.user,
                setUser: s.setUser,
                student: s.student,
                classInfo: s.class,
                timeTable: s.timeTable,
                enrollSubject: s.enrollSubjects
            })),
        );
    const [isLoading, setLoading] = useState(true);
    const [isAuthenticated, setAuthenticate] = useState(false);
    const [attendanceSubjectId, setAttendanceSubjectId] = useState<string | null>(null)
    const [attendanceLectures, setAttendanceLectures] = useState<LectureAttendance[]>([])
    const [attendanceLoading, setAttendanceLoading] = useState(false)
    const [attendanceError, setAttendanceError] = useState<string | null>(null)
    const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
        total: 0,
        present: 0,
        absent: 0,
        unmarked: 0,
        percentage: 0,
    })

    const handleSignOut = () => {

        localStorage.removeItem("token")
        navigate("/auth")

    }

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }
        else {
            setAuthenticate(true);
        }

        async function init(token: string) {
            try {
                Promise.all([setUser(token)])
                    .then(() => {
                        setAuthenticate(true);
                        setLoading(false);
                        console.log(enrollSubject);
                    });

            } catch {
                localStorage.removeItem("token");
                setAuthenticate(true);
                setLoading(false);
            }
        }

        init(token);
    }, []);

    useEffect(() => {
        if (enrollSubject && enrollSubject.length > 0) {
            const firstSubjectId = enrollSubject[0].subject.id;
            setAttendanceSubjectId(firstSubjectId);
        }
    }, [enrollSubject]);

    useEffect(() => {
        if (!attendanceSubjectId) return;
        fetchAttendanceForSubject(attendanceSubjectId);
    }, [attendanceSubjectId]);

    const computeAttendanceStats = (lectures: LectureAttendance[]) => {
        const records = lectures.map((lecture) => {
            const matched = lecture.attendance?.find(
                (item) => item.studentId === student?.id,
            )
            return {
                status: matched?.status ?? 'NOT_MARKED',
            }
        })

        const present = records.filter((item) => item.status === 'PRESENT').length
        const absent = records.filter((item) => item.status === 'ABSENT').length
        const unmarked = records.filter((item) => item.status === 'NOT_MARKED').length
        const total = lectures.length
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0

        setAttendanceStats({
            total,
            present,
            absent,
            unmarked,
            percentage,
        })
    }

    const fetchAttendanceForSubject = async (subjectId: string) => {
        setAttendanceLoading(true)
        setAttendanceError(null)

        const token = localStorage.getItem('token')
        if (!token) {
            setAttendanceError('Authentication required. Please sign in again.')
            setAttendanceLoading(false)
            return
        }

        try {
            const res = await fetch(
                `${BACKEND_URL}/api/attendance/get-attendance/${subjectId}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            )

            const data = await res.json()
            if (!res.ok || !data.success) {
                throw new Error(data?.message || data?.error || 'Unable to load attendance data.')
            }

            const lectures = data.data as LectureAttendance[]
            setAttendanceLectures(lectures)
            computeAttendanceStats(lectures)
        } catch (error) {
            setAttendanceLectures([])
            setAttendanceStats({ total: 0, present: 0, absent: 0, unmarked: 0, percentage: 0 })
            setAttendanceError(
                error instanceof Error
                    ? error.message
                    : 'Unable to load attendance data.',
            )
        } finally {
            setAttendanceLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <Loader></Loader>
            </div>
        );
    }

    if (isAuthenticated === false) {
        return (
            <div className="flex items-center justify-center text-7xl text-red-600">
                <p>401</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-linear-to-br from-[#f0f5ff] via-[#f0f5ff] to-[#1c69e3]/5">
            <nav className="top-0 z-50 sticky border-b border-[#eceef5]/50 backdrop-blur-3xl bg-[#ffffff]/50">
                <div className="max-w-7xl flex justify-between items-center px-6 py-4 mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 text-xl font-semibold text-white flex items-center justify-center rounded-xl bg-[#4781e8]">
                            A
                        </div>

                        <div>
                            <h1 className="font-semibold text-lg">AttendX Portal</h1>
                            <p className="text-xs text-gray-500">Student Dashboard</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        onSubmit={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-[#dadee5] rounded-lg transition-all duration-300 cursor-pointer">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-9 px-3 space-y-8">
                <div className="grid md:grid-cols-3 gap-6 animate-slide-up">
                    <div className="md:col-span-2 shadow-lg p-8 shadow-blue-100 hover:shadow-lg/50 transition-all duration-500 rounded-2xl bg-white">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex gap-6 flex-1">
                                <img className="w-24 h-24 rounded-xl object-cover border-2 border-blue-200"></img>

                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-2">{user?.name}</h2>

                                    <p className="text-sm text-gray-500 mb-4">{user?.username}</p>

                                    <div className="flex gap-6 text-sm">
                                        <div>
                                            <p className="text-gray-500">Student Id</p>
                                            <p className="text-sm font-medium">{student?.rollNum}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Class Name</p>
                                            <p className="text-sm font-medium">{classInfo?.name}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Enrollment Year</p>

                                            <p className="text-sm font-medium">{new Date(student!.createdAt).getFullYear()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                            <div>Progress</div>
                        </div>
                    </div>

                    <div
                        onClick={() => setShowQRScanner(true)}
                        className="bg-linear-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 hover:from-primary/15 hover:to-primary/10 transition-all duration-300 group animate-slide-up-delay-2"
                    >
                        <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors duration-300">
                            <QrCode className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground text-center mb-1">Attendance</h3>
                        <p className="text-sm text-muted-foreground text-center">Scan QR to mark attendance</p>
                        <div className="mt-4 text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
                            Scan Now →
                        </div>
                    </div>
                </div>

                <div className="animate-slide-up-delay-2">
                    <div className="w-full flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-2xl font-medium">Enrolled Classes</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                You are enrolled in {enrollSubject?.length ?? 0} courses
                            </p>
                        </div>

                        <button className="text-blue-600 text-sm px-4 py-2 hover:bg-[#dae5fd] rounded-xl">
                            View All →
                        </button>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        {enrollSubject && enrollSubject.length > 0 ? enrollSubject.map((clx, idx) => {
                            const isActive = attendanceSubjectId === clx.subject.id
                            return (
                                <div
                                    key={clx.subject.id}
                                    onClick={() => setAttendanceSubjectId(clx.subject.id)}
                                    className={`rounded-2xl p-6 text-white shadow-lg transition-all duration-300 cursor-pointer group animate-slide-up-delay-${idx + 3} ${isActive ? 'bg-[#1f4fdb] shadow-blue-300' : 'bg-linear-to-br from-[#3c7feb] to-[#5ea0f1] hover:shadow-xl hover:scale-103'}`}
                                    style={{ animationDelay: `${(idx + 2) * 100}ms` }}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h2 className="text-lg font-semibold">{clx.subject.name}</h2>
                                            <p className="text-sm font-extralight">{clx.subject.courseCode}</p>
                                        </div>

                                        <BookOpen className="w-6 h-6 text-white/60" />
                                    </div>
                                </div>
                            )
                        }) : null}
                    </div>

                    <div className="w-full flex items-center mb-6">
                        <div>
                            <h3 className="text-2xl font-medium">Face Biometric Setup</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Register your face for secure attendance verification.
                            </p>
                        </div>
                    </div>

                    <div className="mb-8 animate-slide-up-delay-2">
                        <FaceRegistration />
                    </div>

                    <div className="w-full flex items-center mb-6">
                        <div>
                            <h3 className="text-2xl font-medium">Subject Attendance</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                View your attendance record for the selected subject.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-[minmax(0,280px)_1fr] mb-8 items-start">
                        <div className="bg-white border border-[#eceef5] rounded-3xl p-6 shadow-sm w-full">
                            <label className="text-sm font-medium text-gray-600">Selected subject</label>
                            <select
                                value={attendanceSubjectId ?? ''}
                                onChange={(e) => setAttendanceSubjectId(e.target.value)}
                                className="w-full mt-3 rounded-2xl border border-[#d9e2ff] bg-[#f8fbff] px-4 py-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {enrollSubject?.map((subject) => (
                                    <option key={subject.subject.id} value={subject.subject.id}>
                                        {subject.subject.name}
                                    </option>
                                ))}
                            </select>

                            <div className="mt-6 space-y-4">
                                <div className="rounded-3xl bg-[#f2f7ff] p-4">
                                    <p className="text-xs text-gray-500">Total lectures</p>
                                    <p className="mt-2 text-3xl font-semibold text-[#1f3bb3]">{attendanceStats.total}</p>
                                </div>
                                <div className="rounded-3xl bg-[#ecfdf5] p-4">
                                    <p className="text-xs text-gray-500">Present</p>
                                    <p className="mt-2 text-3xl font-semibold text-[#0f7a4f]">{attendanceStats.present}</p>
                                </div>
                                <div className="rounded-3xl bg-[#fff1f3] p-4">
                                    <p className="text-xs text-gray-500">Absent</p>
                                    <p className="mt-2 text-3xl font-semibold text-[#b32d3f]">{attendanceStats.absent}</p>
                                </div>
                                <div className="rounded-3xl bg-[#fff7ed] p-4">
                                    <p className="text-xs text-gray-500">Attendance%</p>
                                    <p className="mt-2 text-3xl font-semibold text-[#c46d08]">{attendanceStats.percentage}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-[#eceef5] rounded-3xl p-6 shadow-sm w-full">
                            <h4 className="text-lg font-semibold mb-4">Lecture history</h4>
                            {attendanceLoading ? (
                                <div className="flex items-center justify-center py-14">
                                    <Loader className="w-8 h-8 text-primary" />
                                </div>
                            ) : attendanceError ? (
                                <p className="text-sm text-red-600">{attendanceError}</p>
                            ) : attendanceLectures.length === 0 ? (
                                <p className="text-sm text-gray-500">No lecture attendance data available for this subject.</p>
                            ) : (
                                <div className="space-y-3 max-h-9 overflow-y-auto pr-2 sm:max-h-119">
                                    {attendanceLectures.slice(0, ).map((lecture, idx) => {
                                        const studentRecord = lecture.attendance?.find(
                                            (item) => item.studentId === student?.id,
                                        )
                                        const status = studentRecord?.status ?? 'NOT_MARKED'
                                        const badgeClass = status === 'PRESENT'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : status === 'ABSENT'
                                                ? 'bg-rose-100 text-rose-700'
                                                : 'bg-slate-100 text-slate-700'

                                        return (
                                            <div key={lecture.id} className="rounded-3xl border border-[#eff3ff] p-4 flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-medium text-[#111827]">Lecture {idx + 1}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(lecture.date).toLocaleDateString()} • {new Date(lecture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                                                    {status === 'NOT_MARKED' ? 'Not marked' : status}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full flex items-center">
                        <div className="mb-6">
                            <h3 className="text-2xl font-medium">Weekly Timetable</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Your weekly schedule for this week
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#ffffff] border border-[#eceef5] rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#f0f5ff]">
                            {timeTable!.map((daySchedule) => (
                                <div key={daySchedule.day} className="p-6">
                                    <h4 className="font-bold text-[#132139] mb-4 text-lg">
                                        {daySchedule.day}
                                    </h4>
                                    {daySchedule.periods.length > 0 ? (
                                        <div className="space-y-3">
                                            {daySchedule.periods.map((cls, cidx) => (
                                                <div
                                                    key={cidx}
                                                    className="pl-4 border-l-4 border-[#1c69e3]/50 hover:border-[#1c69e3] py-2 transition-colors duration-300"
                                                >
                                                    <p className="text-sm font-medium text-[#132139]">
                                                        {cls.subject.name}
                                                    </p>
                                                    <p className="text-sm font-medium text-[#132139]">
                                                        {new Date(cls.startTime).toLocaleTimeString().slice(0, -3)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-[#132139]">No classes</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            {showQRScanner && (
                <QRScanner onClose={() => setShowQRScanner(false)} />
            )}
        </div>
    );
}