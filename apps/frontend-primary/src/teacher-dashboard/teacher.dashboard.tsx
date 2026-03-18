import { LogOutIcon } from "lucide-react";
import { useState } from "react";
import react from '../assets/react.svg'
import { Mail, Phone, MapPin, BookOpen, Clock, Award, Users2, Calendar, Plus } from "lucide-react";
import LectureCard from "@workspace/ui/components/ui/lecture-card"
import ClassCard from "@workspace/ui/components/ui/class-card";

interface Teacher {
    id: string
    name: string
    email: string
    phone: string
    department: string
    subject: string
    joinDate: string
    officeRoom: string
}

interface Class {
    id: string
    name: string
    code: string
    students: string[]
    schedule: string
    room: string
    color: string
}

interface Lecture {
    id: string
    classId: string
    lectureId: string
    qrCode: string
    date: string
    time: string
    attendance: number
}

interface Event {
    id: string
    title: string
    date: string
    time: string
    description: string
    type: 'exam' | 'assignment' | 'seminar' | 'other'
}

export default function TeacherDashboard() {

    const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'lectures' | 'events'>('overview')

    const [teacher] = useState<Teacher>({
        id: 'T001',
        name: 'Prof Nobita',
        email: 'nobita@krmu.edu.in',
        phone: '+91 xxx-xxx-xxxx',
        department: 'Computer Science',
        subject: 'Web Development & Data Structures',
        joinDate: 'August 2026',
        officeRoom: 'Building A, Room 301'
    })

    const [classes, setClasses] = useState<Class[]>([
        {
            id: '1',
            name: 'Web Development',
            code: 'CS101',
            students: ['S001', 'S002', 'S003', 'S004', 'S005'],
            schedule: 'Mon & Wed 10:00 AM',
            room: 'Lab 301',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            id: '2',
            name: 'Data Structures',
            code: 'CS102',
            students: ['S001', 'S003', 'S006', 'S007'],
            schedule: 'Tue & Thu 2:00 PM',
            room: 'Lab 302',
            color: 'from-purple-500 to-pink-500',
        },
    ])

    const [lectures, setLectures] = useState<Lecture[]>([
        {
            id: '1',
            classId: '1',
            lectureId: 'LEC-2024-001',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LEC-2024-001',
            date: '2024-03-12',
            time: '10:00 AM',
            attendance: 4,
        },
    ])

    const [events, setEvents] = useState<Event[]>([
        {
            id: '1',
            title: 'Mid-Semester Exam',
            date: '2024-03-20',
            time: '10:00 AM',
            description: 'CS101 Mid-Semester Examination',
            type: 'exam',
        },
    ])

    const [isCreateClassOpen, setIsCreateClassOpen] = useState(false)
    const [isCreateLectureOpen, setIsCreateLectureOpen] = useState(false)
    const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
    const [isStudentManagementOpen, setIsStudentManagementOpen] = useState(false)
    const [selectedClass, setSelectedClass] = useState<Class | null>(null)

    const handleCreateClass = (classData: Omit<Class, 'id' | 'students'>) => {
        const newClass: Class = {
            ...classData,
            id: Math.random().toString(),
            students: [],
        }
        setClasses([...classes, newClass])
        setIsCreateClassOpen(false)
    }

    const handleCreateLecture = (lectureData: Omit<Lecture, 'id' | 'qrCode' | 'attendance'>) => {
        const newLecture: Lecture = {
            ...lectureData,
            id: Math.random().toString(),
            qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${lectureData.lectureId}`,
            attendance: 0,
        }
        setLectures([...lectures, newLecture])
        setIsCreateLectureOpen(false)
    }

    const handleCreateEvent = (eventData: Omit<Event, 'id'>) => {
        const newEvent: Event = {
            ...eventData,
            id: Math.random().toString(),
        }
        setEvents([...events, newEvent])
        setIsCreateEventOpen(false)
    }

    const handleAddStudent = (studentId: string) => {
        if (selectedClass && !selectedClass.students.includes(studentId)) {
            const updatedClasses = classes.map((c) =>
                c.id === selectedClass.id ? { ...c, students: [...c.students, studentId] } : c
            )
            setClasses(updatedClasses)
            setSelectedClass(updatedClasses.find((c) => c.id === selectedClass.id) || null)
        }
    }

    const handleRemoveStudent = (studentId: string) => {
        if (selectedClass) {
            const updatedClasses = classes.map((c) =>
                c.id === selectedClass.id ? { ...c, students: c.students.filter((s) => s !== studentId) } : c
            )
            setClasses(updatedClasses)
            setSelectedClass(updatedClasses.find((c) => c.id === selectedClass.id) || null)
        }
    }

    const handleDeleteClass = (classId: string) => {
        setClasses(classes.filter((c) => c.id !== classId))
    }

    const handleDeleteLecture = (lectureId: string) => {
        setLectures(lectures.filter((l) => l.id !== lectureId))
    }

    const handleDeleteEvent = (eventId: string) => {
        setEvents(events.filter((e) => e.id !== eventId))
    }

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
                                        <h2 className="text-3xl font-bold text-foreground mb-2">Prof Nobita</h2>
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
                                                <p className="text-sm font-medium text-foreground">{teacher.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <Phone className="w-5 h-5 text-primary flex shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                                                <p className="text-sm font-medium text-foreground">{teacher.phone}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-primary flex shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Office</p>
                                                <p className="text-sm font-medium text-foreground">{teacher.officeRoom}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Award className="w-5 h-5 text-primary flex shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Joined</p>
                                                <p className="text-sm font-medium text-foreground">{teacher.joinDate}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-border">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Subjects</p>
                                        <p className="text-foreground">{teacher.subject}</p>
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

            </main>

        </div>
    );
}
