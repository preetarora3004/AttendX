import { LogOutIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import react from "../assets/react.svg";
import {
   Mail,
   MapPin,
   BookOpen,
   Clock,
   Award,
   Users2,
   Calendar,
   Plus,
   Loader,
} from "lucide-react";

const BACKEND_URL = 'https://attendx-t48b.onrender.com'
import LectureCard from "./components/lecture-card";
import SubjectCard from "./components/subject.card";
import ClassCard from "./components/class.card";
import { store } from "@workspace/utils/store/zustand";
import { useShallow } from "zustand/shallow";

export default function TeacherDashboard() {
   const {
      teacher,
      setTeacher,
      user,
      enrolledClasses,
      enrolledSubject,
      classList,
      TeacherDash,
   } = store(
      useShallow((s) => ({
         teacher: s.teacher,
         setTeacher: s.setTeacher,
         user: s.user,
         TeacherDash: s.teacherDash,
         enrolledClasses: s.teacherEnolledClass,
         enrolledSubject: s.teacherEnrolledSubject,
         classList: s.classList,
      })),
   );
   const [activeTab, setActiveTab] = useState<
      "overview" | "classes" | "lectures" | "events"
   >("overview");
   const [, setIsCreateClassOpen] = useState(false);
   const [, setIsCreateEventOpen] = useState(false);
   const [, setIsStudentManagementOpen] = useState(false);
   const [isLoading, setLoading] = useState(true);
   const [authenticated, setAuthenticated] = useState(false);

   useEffect(() => {
      const token = localStorage.getItem("token");
      console.log("running");
      if (!token) return;

      async function init(token: string) {
         Promise.all([setTeacher(token)]).then(() => {
            setLoading(false);
            setAuthenticated(true);
         });
         console.log(TeacherDash);
      }

      init(token);
   }, []);

   const events = ["E1"];
   const [lectures, setLectures] = useState<any[]>([]);
   const intervalMapRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

   const handleDeleteClass = (_classId: string) => {
      // setClasses(classList!.filter((c) => c.id !== _classId))
   };

   const setupQrRefresh = (lectureId: string, subjectId: string) => {
      if (intervalMapRef.current.has(lectureId)) {
         clearInterval(intervalMapRef.current.get(lectureId)!);
         intervalMapRef.current.delete(lectureId);
      }

      const interval = setInterval(async () => {
         try {
            const qrRes = await fetch("https://attendx-t48b.onrender.com/api/qr/create", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({
                  subjectId,
                  lectureId,
               }),
            });

            const qrData = await qrRes.json();
            if (!qrRes.ok || !qrData.success) {
               console.error("Failed to refresh QR code");
               return;
            }

            setLectures((prev) =>
               prev.map((item) =>
                  item.id === lectureId
                     ? { ...item, qrCode: qrData.data }
                     : item
               )
            );
         } catch (error) {
            console.error("Error refreshing QR code:", error);
         }
      }, 15000);

      intervalMapRef.current.set(lectureId, interval);
   };

   const handleDeleteLecture = async (lectureId: string) => {
      const token = localStorage.getItem("token")
      if (!token) return;

      try {
         const res = await fetch(`${BACKEND_URL}/api/attendance/lecture/${lectureId}/mark-absent`, {
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
         })

         const data = await res.json()
         if (!res.ok || !data.success) {
            throw new Error(data?.message || data?.error || "Failed to mark absent students")
         }
      } catch (error) {
         console.error("Failed to mark lecture absent before delete:", error)
         return
      }

      if (intervalMapRef.current.has(lectureId)) {
         clearInterval(intervalMapRef.current.get(lectureId)!)
         intervalMapRef.current.delete(lectureId)
      }
      setLectures((prev) => prev.filter((item) => item.id !== lectureId))
   };

   const handleCreateLecture = async (subjectId: string) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
         const createRes = await fetch("https://attendx-t48b.onrender.com/api/teacher/lecture", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ subjectId }),
         });

         const createData = await createRes.json();
         if (!createRes.ok || !createData.success) {
            throw new Error(createData?.message || "Failed to create lecture")
         }

         const lectureResponse = createData.data;
         const qrRes = await fetch("https://attendx-t48b.onrender.com/api/qr/create", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               subjectId: lectureResponse.subjectId,
               lectureId: lectureResponse.id,
            }),
         });

         const qrData = await qrRes.json();
         if (!qrRes.ok || !qrData.success) {
            throw new Error(qrData?.message || "Failed to generate QR code")
         }

         const newLecture = {
            id: lectureResponse.id,
            lectureId: lectureResponse.id,
            subjectId: lectureResponse.subjectId,
            date: new Date().toISOString(),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            qrCode: qrData.data,
         };

         setLectures((prev) => [newLecture, ...prev]);

         setupQrRefresh(lectureResponse.id, lectureResponse.subjectId);
      } catch (error) {
         console.error("Failed to create lecture", error);
      }
   };

   if (isLoading) {
      return (
         <div className="flex justify-center items-center">
            <Loader></Loader>
         </div>
      );
   }

   if (!authenticated) {
      return <div className="flex items-center justify-center">401</div>;
   }

   function formatClasses(data: any) {
      if (!data?.teacher) return [];

      return data.teacher.classes.map((cls: any) => {
         const enrolledSubjects = cls.students.flatMap((student: any) =>
            student.enrolledSubjects.map((es: any) => ({
               id: es.id,
               student: {
                  id: student.id,
                  rollNum: student.rollNum,
               },
            })),
         );
         const schedule = cls.weeklyTimeTable.map((dayEntry: any) => ({
            day: dayEntry.day,
            periods: dayEntry.periods.map((p: any) => ({
               id: p.id,
               subject: p.subject.name,
               courseCode: p.subject.courseCode,
               time: new Date(p.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
               }),
            })),
         }));

         return {
            id: cls.id,
            name: cls.name,
            courseCode:
               cls.weeklyTimeTable[0]?.periods[0]?.subject.courseCode || "N/A",
            enrolledSubjects,
            schedule,
            room: "N/A",
         };
      });
   }

   const formatted = formatClasses(TeacherDash);

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
                  <span className="font-medium">Logout</span>
               </button>
            </div>
         </nav>

         <main className="max-w-7xl px-6 py-8 mx-auto">
            <div className="flex gap-2 overflow-x-auto  border-b-2 pb-5 mb-8">
               {["overview", "classes", "lectures", "events"].map((tab) => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab as any)}
                     className={`rounded-lg px-6 py-2 font-semibold whitespace-nowrap transition-all duration-200 ${activeTab === tab ? "bg-[#1c6ae4] text-white" : "hover:bg-[#dadee5]"}`}
                  >
                     {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
               ))}
            </div>

            {activeTab === "overview" && (
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
                              <h2 className="text-3xl font-bold text-foreground mb-2">
                                 {user?.name}
                              </h2>
                              <div className="flex flex-wrap gap-3">
                                 <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                    Computer Science
                                 </span>
                                 <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                                    teacher.qualification
                                 </span>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                              <div className="flex items-start gap-3">
                                 <Mail className="w-5 h-5 text-primary flex shrink-0 mt-0.5" />
                                 <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                       Email
                                    </p>
                                    <p className="text-sm font-medium text-foreground">
                                       {user?.username}
                                    </p>
                                 </div>
                              </div>

                              <div className="flex items-start gap-3">
                                 <MapPin className="w-5 h-5 text-primary flex shrink-0 mt-0.5" />
                                 <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                       Office
                                    </p>
                                    <p className="text-sm font-medium text-foreground">
                                       {teacher?.office}
                                    </p>
                                 </div>
                              </div>

                              <div className="flex items-start gap-3">
                                 <Award className="w-5 h-5 text-primary flex shrink-0 mt-0.5" />
                                 <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                       Joined
                                    </p>
                                    <p className="text-sm font-medium text-foreground">
                                       {new Date(teacher!.createdAt).toLocaleDateString()}
                                    </p>
                                 </div>
                              </div>
                           </div>

                           <div className="mt-6 pt-6 border-t border-border">
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                 Subjects
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                 {enrolledSubject?.map((sbj) => (
                                    <p key={sbj.id} className="text-foreground">
                                       {sbj.name}
                                    </p>
                                 ))}
                              </div>
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
                              <p className="text-muted-foreground text-sm">Total Class</p>
                              <p className="text-3xl font-bold text-foreground mt-2">
                                 {enrolledClasses?.length}
                              </p>
                           </div>
                           <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-primary" />
                           </div>
                        </div>
                     </div>

                     <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-500 animate-slide-up-delay-2">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-muted-foreground text-sm">
                                 Total Students
                              </p>
                              <p className="text-3xl font-bold text-foreground mt-2">
                                 {classList!.reduce(
                                    (sum, c) => sum + c.students.length,
                                    0,
                                 )}
                              </p>
                           </div>
                           <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                              <Users2 className="w-6 h-6 text-secondary" />
                           </div>
                        </div>
                     </div>

                     <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-500 animate-slide-up-delay-3">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-muted-foreground text-sm">
                                 Active Lectures
                              </p>
                              <p className="text-3xl font-bold text-foreground mt-2">
                                 {lectures.length}
                              </p>
                           </div>
                           <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                              <Clock className="w-6 h-6 text-accent" />
                           </div>
                        </div>
                     </div>

                     <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-500 animate-slide-up-delay-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-muted-foreground text-sm">
                                 Upcoming Events
                              </p>
                              <p className="text-3xl font-bold text-foreground mt-2">
                                 {events.length}
                              </p>
                           </div>
                           <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-purple-500" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div>
                     <div className="flex items-center justify-between mb-6 animate-slide-up-delay-2">
                        <h2 className="text-2xl font-bold text-foreground">
                           Your Classes
                        </h2>
                        <button
                           onClick={() => setIsCreateClassOpen(true)}
                           className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 font-medium hover:shadow-lg hover:shadow-primary/30"
                        >
                           <Plus className="w-4 h-4" />
                           New Class
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formatted!.map((classItem: any, idx: any) => (
                           <ClassCard
                              key={classItem.id}
                              class={classItem}
                              delay={idx}
                              onManageStudents={() => {
                                 setIsStudentManagementOpen(true);
                              }}
                              onDelete={handleDeleteClass}
                           />
                        ))}
                     </div>
                  </div>

                  <div>
                     <div className="flex items-center justify-between mb-6 animate-slide-up-delay-3">
                        <h2 className="text-2xl font-bold text-foreground">
                           Recent Lectures
                        </h2>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {enrolledSubject!.map((subjectItem: any, idx: any) => (
                           <SubjectCard
                              key={subjectItem.id}
                              subject={subjectItem}
                              delay={idx}
                              onManageStudents={() => {
                                 setIsStudentManagementOpen(true);
                              }}
                              onDelete={handleDeleteClass}
                              onCreateLecture={handleCreateLecture}
                           />
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {activeTab === "classes" && (
               <div className="space-y-6">
                  <div className="flex items-center justify-between animate-slide-up-delay">
                     <h2 className="text-2xl font-bold text-foreground">
                        All Classes
                     </h2>
                     <button
                        onClick={() => setIsCreateClassOpen(true)}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 font-medium hover:shadow-lg hover:shadow-primary/30"
                     >
                        <Plus className="w-4 h-4" />
                        New Class
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {formatted!.map((classItem: any, idx: any) => (
                        <ClassCard
                           key={classItem.id}
                           class={classItem}
                           delay={idx}
                           onManageStudents={() => {
                              // setSelectedClass(classItem)
                              setIsStudentManagementOpen(true);
                           }}
                           onDelete={handleDeleteClass}
                        />
                     ))}
                  </div>
               </div>
            )}

            {activeTab === "lectures" && (
               <div className="space-y-6">
                  <div className="flex items-center justify-between animate-slide-up-delay">
                     <h2 className="text-2xl font-bold text-foreground">
                        All Lectures
                     </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {lectures.length > 0 ? (
                        lectures.map((lecture: any, idx: number) => (
                           <LectureCard
                              key={lecture.id}
                              lecture={lecture}
                              delay={idx}
                              onDelete={() => handleDeleteLecture(lecture.id)}
                           />
                        ))
                     ) : (
                        <div className="col-span-1 md:col-span-2 rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                           No lectures created yet. Use the subject cards to create a lecture and generate its QR.
                        </div>
                     )}
                  </div>
               </div>
            )}

            {activeTab === "events" && (
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
               </div>
            )}
         </main>

      </div>
   );
}
