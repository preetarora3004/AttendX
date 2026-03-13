'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface CreateLectureModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (lectureData: any) => void
    classes: Array<{ id: string; name: string; code: string }>
}

export default function CreateLectureModal({ isOpen, onClose, onSubmit, classes }: CreateLectureModalProps) {

    if (typeof classes[0] === "undefined") return null;
    const [formData, setFormData] = useState({
        classId: classes.length > 0 ? classes[0].id : '',
        lectureId: '',
        date: '',
        time: '',
    })

    const generateLectureId = () => {
        const timestamp = new Date().getTime()
        const lectureId = `LEC-${new Date().getFullYear()}-${String(timestamp).slice(-6)}`
        setFormData({ ...formData, lectureId })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (typeof classes[0] === "undefined") return null;
        if (formData.classId && formData.lectureId && formData.date && formData.time) {
            onSubmit(formData)
            setFormData({
                classId: classes.length > 0 ? classes[0].id : '',
                lectureId: '',
                date: '',
                time: '',
            })
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full animate-slide-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary/60 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-primary-foreground">Create New Lecture</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-primary-foreground" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Class Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Select Class</label>
                        <select
                            value={formData.classId}
                            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-foreground"
                        >
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name} ({cls.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lecture ID */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-foreground">Lecture ID</label>
                            <button
                                type="button"
                                onClick={generateLectureId}
                                className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-semibold"
                            >
                                Generate
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="e.g., LEC-2024-001"
                            value={formData.lectureId}
                            onChange={(e) => setFormData({ ...formData, lectureId: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-foreground placeholder-muted-foreground font-mono"
                            readOnly
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-foreground"
                        />
                    </div>

                    {/* Time */}
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Time</label>
                        <input
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-foreground"
                        />
                    </div>

                    {/* Info */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-xs text-primary font-medium">
                            ✓ QR code will be automatically generated when you create the lecture
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                        >
                            Create Lecture
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
