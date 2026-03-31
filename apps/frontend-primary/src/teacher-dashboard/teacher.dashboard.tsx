import { LogOutIcon } from "lucide-react";
import { useEffect, useState } from "react";
import react from '../assets/react.svg'
import { Mail, MapPin, BookOpen, Clock, Award, Users2, Calendar, Plus } from "lucide-react";
import LectureCard from "./components/lecture-card"
import ClassCard from "./components/class.card";
import EventCard from './components/event.card'
import CreateClassModal from './components/create.class.modal'
import CreateLectureModal from './components/create.lecture.modal'
import CreateEventModal from './components/create.event.modal'
import StudentManagementModal from './components/student.management.modal'
import { store } from "@workspace/utils/store/zustand";
import { useShallow } from "zustand/shallow";

export default function TeacherDashboard() {

    const { teacher, setTeacher, user, loadUser } = store(useShallow((s) => ({
        teacher: s.teacher,
        setTeacher: s.setTeacher,
        user: s.user,
        loadUser: s.setUser
    })))
    const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'lectures' | 'events'>('overview')
    const [isCreateClassOpen, setIsCreateClassOpen] = useState(false)
    const [isCreateLectureOpen, setIsCreateLectureOpen] = useState(false)
    const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
    const [isStudentManagementOpen, setIsStudentManagementOpen] = useState(false)

    useEffect(() => {

        const token = localStorage.getItem("token")
        if (!token) return;

        async function init(token: string) {
            await Promise.all([loadUser(token), setTeacher(token)]);
        }

        init(token);
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f0f5ff] via-[#f0f5ff] to-[#1c69e3]/5">
            <nav className="top-0 z-50 sticky border-b border-[#eceef5]/50 backdrop-blur-3xl bg-[#ffffff]/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 gap-3">
                    <div>
                        <h1 className="text-xl md:text-xl lg:text-3xl font-semibold">
                            Teacher Dashboard
                        </h1>
                        <p className="text-xs md:text-sm lg:text-sm text-gray-500">
                            Manage your classes and time
                        </p>
                    </div>


                    <button className="flex justify-center items-center gap-2 text-red-600 rounded-lg transition-all duration-300 cursor-pointer hover:bg-[#fccfd2] px-4 py-2 bg-[#f5dee1]">
                        <LogOutIcon className="w-4 h-4" />
                        <span className="font-medium">
                            Logout
                        </span>
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl px-6 py-8 mx-auto">
                <div className="flex gap-2 overflow-x-auto  border-b-2 pb-5 mb-8">
                    {["overview", "classes", "lectures", "events"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`rounded-lg px-6 py-2 font-semibold whitespace-nowrap transition-all duration-200 ${activeTab === tab ? 'bg-[#1c6ae4] text-white' : "hover:bg-[#dadee5]"}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <div className="bg-linear-to-tr from-blue-100 via-blue-100 to-blue-50 border border-border rounded-3xl p-8 backdrop-blur-sm hover:shadow-xl transition-all duration-500 animate-slide-up-delay">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                                <div className="flex shrink-0">
                                    <img
                                        src={react}
                                        alt={"React"}
                                        className="w-24 h-24 rounded-2xl border-4 border-primary/20 object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-bold text-foreground mb-2">{user?.name}</h2>
                                        <div className="flex flex-wrap gap-3">
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Computer Science</span>
                                            <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">teacher.qualification</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-primary flex shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                                                <p className="text-sm font-medium text-foreground">{user?.username}</p>
                                            </div>
                                        </div>


                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-primary flex shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Office</p>
                                                <p className="text-sm font-medium text-foreground">{teacher?.office}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Award className="w-5 h-5 text-primary flex shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Joined</p>
                                                <p className="text-sm font-medium text-foreground">{new Date(teacher!.createdAt).toDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-border">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Subjects</p>
                                        <p className="text-foreground">{teacher?.subjects}</p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 w-full md:w-auto">
                                    <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium">
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-500 animate-slide-up-delay">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm">Total Classes</p>
                                        <p className="text-3xl font-bold text-foreground mt-2">{classes.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-500 animate-slide-up-delay-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm">Total Students</p>
                                        <p className="text-3xl font-bold text-foreground mt-2">{classes.reduce((sum, c) => sum + c.students.length, 0)}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                                        <Users2 className="w-6 h-6 text-secondary" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-500 animate-slide-up-delay-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm">Active Lectures</p>
                                        <p className="text-3xl font-bold text-foreground mt-2">{lectures.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-accent" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-500 animate-slide-up-delay-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground text-sm">Upcoming Events</p>
                                        <p className="text-3xl font-bold text-foreground mt-2">{events.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-purple-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-6 animate-slide-up-delay-2">
                                <h2 className="text-2xl font-bold text-foreground">Your Classes</h2>
                                <button
                                    onClick={() => setIsCreateClassOpen(true)}
                                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 font-medium hover:shadow-lg hover:shadow-primary/30"
                                >
                                    <Plus className="w-4 h-4" />
                                    New Class
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {classes.slice(0, 4).map((classItem, idx) => (
                                    <ClassCard
                                        key={classItem.id}
                                        class={classItem}
                                        delay={idx}
                                        onManageStudents={() => {
                                            setSelectedClass(classItem)
                                            setIsStudentManagementOpen(true)
                                        }}
                                        onDelete={handleDeleteClass}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-6 animate-slide-up-delay-3">
                                <h2 className="text-2xl font-bold text-foreground">Recent Lectures</h2>
                                <button
                                    onClick={() => setIsCreateLectureOpen(true)}
                                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 font-medium hover:shadow-lg hover:shadow-primary/30"
                                >
                                    <Plus className="w-4 h-4" />
                                    New Lecture
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {lectures.slice(0, 2).map((lecture, idx) => (
                                    <LectureCard
                                        key={lecture.id}
                                        lecture={lecture}
                                        classItem={classes.find((c) => c.id === lecture.classId)}
                                        delay={idx}
                                        onDelete={handleDeleteLecture}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'classes' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between animate-slide-up-delay">
                            <h2 className="text-2xl font-bold text-foreground">All Classes</h2>
                            <button
                                onClick={() => setIsCreateClassOpen(true)}
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 font-medium hover:shadow-lg hover:shadow-primary/30"
                            >
                                <Plus className="w-4 h-4" />
                                New Class
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {classes.map((classItem, idx) => (
                                <ClassCard
                                    key={classItem.id}
                                    class={classItem}
                                    delay={idx}
                                    onManageStudents={() => {
                                        setSelectedClass(classItem)
                                        setIsStudentManagementOpen(true)
                                    }}
                                    onDelete={handleDeleteClass}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'lectures' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between animate-slide-up-delay">
                            <h2 className="text-2xl font-bold text-foreground">All Lectures</h2>
                            <button
                                onClick={() => setIsCreateLectureOpen(true)}
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 font-medium hover:shadow-lg hover:shadow-primary/30"
                            >
                                <Plus className="w-4 h-4" />
                                New Lecture
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {lectures.map((lecture, idx) => (
                                <LectureCard
                                    key={lecture.id}
                                    lecture={lecture}
                                    classItem={classes.find((c) => c.id === lecture.classId)}
                                    delay={idx}
                                    onDelete={handleDeleteLecture}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between animate-slide-up-delay">
                            <h2 className="text-2xl font-bold text-foreground">All Events</h2>
                            <button
                                onClick={() => setIsCreateEventOpen(true)}
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 font-medium hover:shadow-lg hover:shadow-primary/30"
                            >
                                <Plus className="w-4 h-4" />
                                New Event
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {events.map((event, idx) => (
                                <EventCard key={event.id} event={event} delay={idx} onDelete={handleDeleteEvent} />
                            ))}
                        </div>
                    </div>
                )}

            </main>

            <CreateClassModal
                isOpen={isCreateClassOpen}
                onClose={() => setIsCreateClassOpen(false)}
                onSubmit={handleCreateClass}
            />

            <CreateLectureModal
                isOpen={isCreateLectureOpen}
                onClose={() => setIsCreateLectureOpen(false)}
                onSubmit={handleCreateLecture}
                classes={classes}
            />

            <CreateEventModal
                isOpen={isCreateEventOpen}
                onClose={() => setIsCreateEventOpen(false)}
                onSubmit={handleCreateEvent}
            />

            {selectedClass && (
                <StudentManagementModal
                    isOpen={isStudentManagementOpen}
                    onClose={() => {
                        setIsStudentManagementOpen(false)
                        setSelectedClass(null)
                    }}
                    class={selectedClass}
                    onAddStudent={handleAddStudent}
                    onRemoveStudent={handleRemoveStudent}
                />
            )}

        </div>
    );
}
