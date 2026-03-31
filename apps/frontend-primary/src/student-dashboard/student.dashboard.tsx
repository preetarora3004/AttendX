import { LogOut, BookOpen, Clock, Calendar, Loader, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { store } from "@workspace/utils/store/zustand";
import { useShallow } from "zustand/shallow";
import QRScanner from "./components/qr-code";
import { useNavigate } from "react-router";

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

    const timetable = [
        {
            day: "Monday",
            classes: ["Data Structures (10:00-11:30 AM)", "AI & ML (1:00-2:30 PM)"],
        },
        {
            day: "Tuesday",
            classes: [
                "Web Development (2:00-3:30 PM)",
                "Linear Algebra (11:00 AM-12:30 PM)",
            ],
        },
        {
            day: "Wednesday",
            classes: ["Data Structures (10:00-11:30 AM)", "AI & ML (1:00-2:30 PM)"],
        },
        {
            day: "Thursday",
            classes: [
                "Web Development (2:00-3:30 PM)",
                "Linear Algebra (11:00 AM-12:30 PM)",
            ],
        },
        { day: "Friday", classes: ["Data Structures (10:00-11:30 AM)"] },
        { day: "Saturday", classes: ["Linear Algebra (11:00 AM-12:30 PM)"] },
    ];

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
                                You are enrolled in 4 courses
                            </p>
                        </div>

                        <button className="text-blue-600 text-sm px-4 py-2 hover:bg-[#dae5fd] rounded-xl">
                            View All →
                        </button>
                    </div>


                    <div className="grid md:grid-cols-2 gap-4 mb-5">
                        {enrollSubject && enrollSubject.length > 0 ? enrollSubject.map((clx, idx) => (
                            <div
                                key={clx.subject.id}
                                className={`bg-linear-to-br from-[#3c7feb] to-[#5ea0f1] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-103 transition-all duration-300 cursor-pointer group
                                animate-slide-up-delay-${idx + 3}`}
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
                        )) : null}
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
                            {timeTable!.map((daySchedule, idx) => (
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
