'use client'

import { useState } from 'react'
import { Calendar, Clock, Eye, EyeOff, Trash2 } from 'lucide-react'
import { formatDate } from '@workspace/ui/lib/date-utils'

interface LectureCardProps {
  lecture: {
    id: string
    lectureId: string
    date: string
    time: string
    qrCode?: string
  }
  delay: number
  onDelete: (lectureId: string) => void
}

export default function LectureCard({ lecture, delay, onDelete }: LectureCardProps) {
  const [showQR, setShowQR] = useState(false)
  const animationDelay = `animate-slide-up-delay-${Math.min(delay + 3, 8)}`
 
  return (
    <div className={`bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 ${animationDelay}`}>
    
      <div className="p-6 space-y-4">
        
        <div className="bg-muted rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Lecture ID</p>
          <p className="font-mono font-bold text-foreground text-lg">{lecture.lectureId}</p>
        </div>

        <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center min-h-48">
          {showQR ? (
            <div className="space-y-4 w-full flex flex-col items-center">
              <div className="relative w-40 h-40 bg-white rounded-lg p-2 flex items-center justify-center">
                {lecture.qrCode ? (
                  <img
                    src={lecture.qrCode}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <p className="text-center text-sm text-muted-foreground">QR not available</p>
                )}
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="w-full px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <EyeOff className="w-4 h-4" />
                Hide QR
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowQR(true)}
              className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Eye className="w-8 h-8" />
              <span className="text-sm font-medium">Click to View QR Code</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Date</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">{formatDate(lecture.date)}</p>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Time</p>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">{lecture.time}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(lecture.id)}
          className="w-full px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Close 
        </button>
      </div>
    </div>
  )
}