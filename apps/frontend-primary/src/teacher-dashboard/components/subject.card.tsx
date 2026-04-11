import { Users, Clock, MapPin, Trash2, Plus, Settings } from "lucide-react";

interface ClassCardProps {
  subject: {
    id: string
    name: string,
    courseCode: string
  }

  delay: number;
  onManageStudents: () => void;
  onDelete: (classId: string) => void;
  onCreateLecture: (subjectId: string) => void;
}

export default function SubjectCard({
  subject: subjectItem,
  delay,
  onManageStudents,
  onDelete,
  onCreateLecture,
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
                {subjectItem.name}
              </h3>
              <p className="text-sm text-muted-foreground font-mono">
                {subjectItem.courseCode}
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
                onClick={() => onDelete(subjectItem.id)}
                className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => onCreateLecture(subjectItem.id)}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 font-medium hover:shadow-lg hover:shadow-primary/30"
        >
          <Plus className="w-4 h-4" />
          New Lecture
        </button>

      </div>
    </div>
  );
}