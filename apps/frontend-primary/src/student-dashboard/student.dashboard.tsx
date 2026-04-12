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