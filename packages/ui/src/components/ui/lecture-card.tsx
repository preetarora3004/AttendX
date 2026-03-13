'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, Eye, EyeOff, Download, Trash2 } from 'lucide-react'

interface LectureCardProps {
    lecture: {
        id: string
        classId: string
        lectureId: string
        qrCode: string
        date: string
        time: string
        attendance: number
    }
    classItem?: {
        name: string
        code: string
    }
    delay: number
    onDelete: (lectureId: string) => void
}

export default function LectureCard({ lecture, classItem, delay, onDelete }: LectureCardProps) {
    const [showQR, setShowQR] = useState(false)
    const animationDelay = `animate-slide-up-delay-${Math.min(delay + 3, 8)}`

    const downloadQR = () => {
        const link = document.createElement('a')
        link.href = lecture.qrCode
        link.download = `${lecture.lectureId}-qr.png`
        link.click()
    }

    return (
        <div className={`bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 ${animationDelay}`}>
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-primary to-primary/60 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5" />
                <div className="relative z-10">
                    <p className="text-primary-foreground/80 text-xs font-semibold uppercase tracking-wider">
                        {classItem?.code || 'Lecture'}
                    </p>
                    <h3 className="text-xl font-bold text-primary-foreground mt-1">{classItem?.name || 'Unknown Class'}</h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Lecture ID */}
                <div className="bg-muted rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Lecture ID</p>
                    <p className="font-mono font-bold text-foreground text-lg">{lecture.lectureId}</p>
                </div>

                {/* QR Code Section */}
                <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center min-h-48">
                    {showQR ? (
                        <div className="space-y-4 w-full flex flex-col items-center">
                            <div className="relative w-40 h-40 bg-white rounded-lg p-2">
                                <img
                                    src={lecture.qrCode}
                                    alt="QR Code"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <button
                                onClick={downloadQR}
                                className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-medium"
                            >
                                <Download className="w-4 h-4" />
                                Download QR
                            </button>
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

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                    <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Date</p>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <p className="text-sm font-semibold text-foreground">{new Date(lecture.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Time</p>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <p className="text-sm font-semibold text-foreground">{lecture.time}</p>
                        </div>
                    </div>

                    <div className="bg-muted rounded-lg p-3 col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Attendance</p>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-secondary" />
                            <p className="text-sm font-semibold text-foreground">{lecture.attendance} students marked</p>
                        </div>
                    </div>
                </div>

                {/* Delete Button */}
                <button
                    onClick={() => onDelete(lecture.id)}
                    className="w-full px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Lecture
                </button>
            </div>
        </div>
    )
}
