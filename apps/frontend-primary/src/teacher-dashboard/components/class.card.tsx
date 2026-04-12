import { Users, Clock, MapPin, Trash2, Settings } from "lucide-react";

interface ClassCardProps {
  class: {
    id: string;
    name: string;
    courseCode: string;

    enrolledSubjects: {
      id: string;
      student: {
        id: string;
        rollNum: number;
      };
    }[];

    schedule: {
      day: string;
      periods: {
        id: string;
        subject: string;
        courseCode: string;
        time: string;
      }[];
    }[];

    room: string;
  };

  delay: number;
  onManageStudents: () => void;
  onDelete: (classId: string) => void;
}

export default function ClassCard({
  class: classItem,
  delay,
  onManageStudents,
  onDelete,
}: ClassCardProps) {
  const animationDelay = `animate-slide-up-delay-${Math.min(delay + 3, 8)}`;

  const dayMap: Record<string, string> = {
    MONDAY: "MON",
    TUESDAY: "TUE",
    WEDNESDAY: "WED",
    THURSDAY: "THU",
    FRIDAY: "FRI",
  };

  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  return (
    <div
      className={`bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 ${animationDelay}`}
    >
      <div className="bg-linear-to-r from-blue-500 to-cyan-500 h-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="p-6 space-y-4">

        <div>
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {classItem.name}
              </h3>
              <p className="text-sm text-muted-foreground font-mono">
                {classItem.courseCode}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onManageStudents}
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDelete(classItem.id)}
                className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>

            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                Students Enrolled
              </p>
              <p className="text-sm font-semibold text-foreground">
                {classItem.enrolledSubjects.length} students
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-secondary" />
            </div>

            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-2">
                Schedule
              </p>

              <div className="grid grid-cols-5 gap-2 text-xs font-medium text-foreground">
                {days.map((day) => {
                  const dayData = classItem.schedule.find(
                    (d) => dayMap[d.day] === day
                  );

                  return (
                    <div
                      key={day}
                      className="bg-muted/50 rounded-lg p-2 space-y-1 min-h-[70px]"
                    >
                      <p className="text-[10px] text-muted-foreground font-bold">
                        {day}
                      </p>

                      {dayData?.periods.length ? (
                        dayData.periods.map((p) => (
                          <div
                            key={p.id}
                            className="bg-primary/10 rounded px-1 py-0.5"
                          >
                            <p className="truncate">{p.subject}</p>
                            <p className="text-[9px] text-muted-foreground">
                              {p.time}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[9px] text-muted-foreground">
                          —
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-accent" />
            </div>

            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-semibold text-foreground">
                {classItem.room}
              </p>
            </div>
          </div>
        </div>

        {classItem.enrolledSubjects.length > 0 && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              Student IDs
            </p>

            <div className="flex flex-wrap gap-2">
              {classItem.enrolledSubjects
                .slice(0, 3)
                .map((student, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                  >
                    {student.student.rollNum}
                  </span>
                ))}

              {classItem.enrolledSubjects.length > 3 && (
                <span className="px-2 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
                  +{classItem.enrolledSubjects.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}