'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface CreateClassModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (classData: any) => void
}

export default function CreateClassModal({ isOpen, onClose, onSubmit }: CreateClassModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    schedule: '',
    room: '',
    color: 'from-blue-500 to-cyan-500',
  })

  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-green-500 to-emerald-500',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.code) {
      onSubmit(formData)
      setFormData({
        name: '',
        code: '',
        schedule: '',
        room: '',
        color: 'from-blue-500 to-cyan-500',
      })
    }
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full animate-slide-up">

        <div className="bg-gradient-to-r from-primary to-primary/60 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-foreground">Create New Class</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Class Name</label>
            <input
              type="text"
              placeholder="e.g., Web Development"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-foreground placeholder-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Class Code</label>
            <input
              type="text"
              placeholder="e.g., CS101"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-foreground placeholder-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Schedule</label>
            <input
              type="text"
              placeholder="e.g., Mon & Wed 10:00 AM"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-foreground placeholder-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Room Number</label>
            <input
              type="text"
              placeholder="e.g., Lab 301"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-foreground placeholder-muted-foreground"
            />
          </div>


          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Class Color</label>
            <div className="grid grid-cols-3 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-full h-12 rounded-lg bg-gradient-to-r ${color} border-2 transition-all ${
                    formData.color === color ? 'border-foreground scale-105' : 'border-border hover:border-foreground/50'
                  }`}
                />
              ))}
            </div>
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
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}