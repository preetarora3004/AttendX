'use client'

import { useState } from 'react'
import { Plus, Calendar, BookOpen, Users, LogOut, ChevronRight, Clock, Mail, Phone, MapPin, Award } from 'lucide-react'
import ClassCard from '@workspace/ui/components/ui/class-card'
import LectureCard from '@workspace/ui/components/ui/lecture-card'
import EventCard from '@workspace/ui/components/ui/event-card'
import CreateClassModal from '@workspace/ui/components/ui/create-class-modal'
import CreateLectureModal from '@workspace/ui/components/ui/create-lecture-modal'
import CreateEventModal from '@workspace/ui/components/ui/create-event-modal'
import StudentManagementModal from '@workspace/ui/components/ui/student-management-modal'

interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  department: string
  subject: string
  joinDate: string
  officeRoom: string
  qualification: string
  avatar: string
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
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science',
    subject: 'Web Development & Data Structures',
    joinDate: 'August 2020',
    officeRoom: 'Building A, Room 301',
    qualification: 'Ph.D. in Computer Science',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="animate-slide-down">
            <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your classes and lectures</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-300 flex items-center gap-2 font-medium">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-border pb-4 animate-slide-up overflow-x-auto">
          {['overview', 'classes', 'lectures', 'events'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Teacher Profile Card */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-border rounded-3xl p-8 backdrop-blur-sm hover:shadow-xl transition-all duration-500 animate-slide-up-delay">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-24 h-24 rounded-2xl border-4 border-primary/20 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Teacher Info */}
                <div className="flex-1">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-foreground mb-2">{teacher.name}</h2>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{teacher.department}</span>
                      <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">{teacher.qualification}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                        <p className="text-sm font-medium text-foreground">{teacher.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                        <p className="text-sm font-medium text-foreground">{teacher.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Office</p>
                        <p className="text-sm font-medium text-foreground">{teacher.officeRoom}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
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

                {/* Edit Button */}
                <div className="flex-shrink-0 w-full md:w-auto">
                  <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
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
                    <Users className="w-6 h-6 text-secondary" />
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

            {/* Recent Classes */}
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

            {/* Recent Lectures */}
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

        {/* Classes Tab */}
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

        {/* Lectures Tab */}
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

        {/* Events Tab */}
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

      {/* Modals */}
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
  )
}
