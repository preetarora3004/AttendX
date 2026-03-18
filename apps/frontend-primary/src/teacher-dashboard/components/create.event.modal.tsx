'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (eventData: any) => void
}

export default function CreateEventModal({ isOpen, onClose, onSubmit }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    type: 'exam' as 'exam' | 'assignment' | 'seminar' | 'other',
  })

  const eventTypes = [
    { value: 'exam', label: 'Exam', icon: '📝' },
    { value: 'assignment', label: 'Assignment', icon: '📋' },
    { value: 'seminar', label: 'Seminar', icon: '🎓' },
    { value: 'other', label: 'Other', icon: '📌' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.date && formData.time) {
      onSubmit(formData)
      setFormData({
        title: '',
        date: '',
        time: '',
        description: '',
        type: 'exam',
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full animate-slide-up">
        
        <div className="bg-linear-to-r from-primary to-primary/60 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-foreground">Create New Event</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Event Title</label>
            <input
              type="text"
              placeholder="e.g., Mid-Semester Exam"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-foreground placeholder-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Event Type</label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map((et) => (
                <button
                  key={et.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: et.value as any })}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    formData.type === et.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-input hover:border-primary/50'
                  }`}
                >
                  <span>{et.icon}</span>
                  <span className="text-xs font-semibold">{et.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
            <textarea
              placeholder="Add event details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-foreground placeholder-muted-foreground resize-none"
              rows={3}
            />
          </div>

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
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
