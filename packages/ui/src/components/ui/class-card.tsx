import { Users, Clock, MapPin, Trash2, Settings } from 'lucide-react'

interface ClassCardProps {
  class: {
    id: string
    name: string
    code: string
    students: string[]
    schedule: string
    room: string
    color: string
  }
  delay: number
  onManageStudents: () => void
  onDelete: (classId: string) => void
}

export default function ClassCard({ class: classItem, delay, onManageStudents, onDelete }: ClassCardProps) {
  const animationDelay = `animate-slide-up-delay-${Math.min(delay + 3, 8)}`

  return (
    <div className={`bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 ${animationDelay}`}>
      {/* Gradient Header */}
      <div className={`bg-gradient-to-r ${classItem.color} h-24 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Class Info */}
        <div>
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-lg font-bold text-foreground">{classItem.name}</h3>
              <p className="text-sm text-muted-foreground font-mono">{classItem.code}</p>
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

        {/* Stats */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Students Enrolled</p>
              <p className="text-sm font-semibold text-foreground">{classItem.students.length} students</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Schedule</p>
              <p className="text-sm font-semibold text-foreground">{classItem.schedule}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-semibold text-foreground">{classItem.room}</p>
            </div>
          </div>
        </div>

        {/* Student List Preview */}
        {classItem.students.length > 0 && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Student IDs</p>
            <div className="flex flex-wrap gap-2">
              {classItem.students.slice(0, 3).map((student, idx) => (
                <span key={idx} className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                  {student}
                </span>
              ))}
              {classItem.students.length > 3 && (
                <span className="px-2 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
                  +{classItem.students.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
