import { LogOut, BookOpen, Clock, Calendar, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { store } from "@workspace/utils/store/zustand";
import { useShallow } from "zustand/shallow";

export function DashBoard() {
    const { student, loadStudent, timeTable, setTimeTable, user, setUser } =
        store(
            useShallow((s) => ({
                user: s.user,
                setUser: s.setUser,
                student: s.student,
                loadStudent: s.setStudent,
                timeTable: s.timeTable,
                setTimeTable: s.setTimeTable,
            })),
        );
    const [isLoading, setLoading] = useState(true);
    const [isAuthenticated, setAuthenticate] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(true);
            return;
        }

        async function init(token: string) {
            try {
                await Promise.all([setUser(token), loadStudent(token)]);
                setAuthenticate(true);
            } catch {
                localStorage.removeItem("token");
                setAuthenticate(false);
            } finally {
                setLoading(true);
            }
        }

        init(token);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
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

    const enrolledClasses = [
        {
            id: "CS101",
            name: "Data Structures",
            professor: "Dr. Kitretsu",
            time: "Mon, Wed, Fri 10:00 AM",
            room: "Building A, Room 205",
            color: "from-blue-500 to-blue-600",
            students: 120,
        },
        {
            id: "CS201",
            name: "Web Development",
            professor: "Prof. Itachi",
            time: "Tue, Thu 2:00 PM",
            room: "Building B, Room 310",
            color: "from-purple-500 to-purple-600",
            students: 95,
        },
        {
            id: "CS301",
            name: "AI & Machine Learning",
            professor: "Dr. Naruto",
            time: "Mon, Wed 1:00 PM",
            room: "Building C, Room 102",
            color: "from-emerald-500 to-emerald-600",
            students: 75,
        },
        {
            id: "MATH201",
            name: "Linear Algebra",
            professor: "Prof. Nobita",
            time: "Tue, Thu, Sat 11:00 AM",
            room: "Building A, Room 150",
            color: "from-orange-500 to-orange-600",
            students: 110,
        },
    ];

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

                    <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-[#dadee5] rounded-lg transition-all duration-300 cursor-pointer">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-9 px-3 space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
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
                                            <p className="text-sm font-medium">{student?.id}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Enrollment Year</p>

                                            <p className="text-sm font-medium">2026</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                            <div>Progress</div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-between items-center">
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

                <div className="grid md:grid-cols-2 gap-4">
                    {enrolledClasses.map((clx, idx) => (
                        <div
                            key={clx.id}
                            className={`bg-linear-to-br ${clx.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-103 transition-all duration-300 cursor-pointer group`}
                            style={{ animationDelay: `${(idx + 2) * 100}ms` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold">{clx.name}</h2>
                                    <p className="text-sm font-extralight">{clx.professor}</p>
                                </div>

                                <BookOpen className="w-6 h-6 text-white/60" />
                            </div>

                            <div className="space-y-2 text-sm text-white/90 mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{clx.time}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{clx.room}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full flex items-center">
                    <div>
                        <h3 className="text-2xl font-medium">Weekly Timetable</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Your weekly schedule for this week
                        </p>
                    </div>
                </div>

                <div className="bg-[#ffffff] border border-[#eceef5] rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#f0f5ff]">
                        {timetable.map((daySchedule, idx) => (
                            <div key={daySchedule.day} className="p-6">
                                <h4 className="font-bold text-[#132139] mb-4 text-lg">
                                    {daySchedule.day}
                                </h4>
                                {daySchedule.classes.length > 0 ? (
                                    <div className="space-y-3">
                                        {daySchedule.classes.map((cls, cidx) => (
                                            <div
                                                key={cidx}
                                                className="pl-4 border-l-4 border-[#1c69e3]/50 hover:border-[#1c69e3] py-2 transition-colors duration-300"
                                            >
                                                <p className="text-sm font-medium text-[#132139]">
                                                    {cls}
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
    );
}
