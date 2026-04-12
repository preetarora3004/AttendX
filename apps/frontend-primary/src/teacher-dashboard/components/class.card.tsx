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