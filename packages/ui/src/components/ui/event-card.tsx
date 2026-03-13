import { Calendar, Clock, BookMarked, AlertCircle, Trophy, FileText, Trash2 } from 'lucide-react'

interface EventCardProps {
  event: {
    id: string
    title: string
    date: string
    time: string
    description: string
    type: 'exam' | 'assignment' | 'seminar' | 'other'
  }
  delay: number
  onDelete: (eventId: string) => void
}

export default function EventCard({ event, delay, onDelete }: EventCardProps) {
  const animationDelay = `animate-slide-up-delay-${Math.min(delay + 3, 8)}`

  const typeConfig = {
    exam: { bg: 'bg-red-500/10', text: 'text-red-500', icon: AlertCircle, label: 'Exam' },
    assignment: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: FileText, label: 'Assignment' },
    seminar: { bg: 'bg-purple-500/10', text: 'text-purple-500', icon: Trophy, label: 'Seminar' },
    other: { bg: 'bg-gray-500/10', text: 'text-gray-500', icon: BookMarked, label: 'Event' },
  }

  const config = typeConfig[event.type]
  const TypeIcon = config.icon

  return (
    <div className={`bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 ${animationDelay}`}>
      {/* Header */}
      <div className={`${config.bg} p-6 border-b border-border`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
              <TypeIcon className={`w-5 h-5 ${config.text}`} />
            </div>
            <div>
              <p className={`text-xs font-semibold ${config.text} uppercase tracking-wider`}>{config.label}</p>
              <h3 className="text-lg font-bold text-foreground mt-1">{event.title}</h3>
            </div>
          </div>
          <button
            onClick={() => onDelete(event.id)}
            className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground">{event.description}</p>

        {/* Date & Time */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-semibold text-foreground">{new Date(event.date).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-sm font-semibold text-foreground">{event.time}</p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="pt-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            Scheduled
          </span>
        </div>
      </div>
    </div>
  )
}
