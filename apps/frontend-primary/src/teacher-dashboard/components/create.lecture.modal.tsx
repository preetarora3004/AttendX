'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface CreateLectureModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (lectureData: any) => void
  subjectId: string
}

export default function CreateLectureModal({ isOpen, onClose, onSubmit, subjectId }: CreateLectureModalProps) {
  const [formData, setFormData] = useState({
    lectureId: '',
    date: '',
    time: '',
  })
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateLectureId = () => {
    const timestamp = new Date().getTime()
    const lectureId = `LEC-${new Date().getFullYear()}-${String(timestamp).slice(-6)}`
    setFormData({ ...formData, lectureId })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.lectureId || !formData.date || !formData.time) {
      setError('Please fill in all fields before generating the QR.')
      return
    }

    if (!subjectId) {
      setError('Missing subject ID.')
      return
    }

    setError(null)
    setIsGenerating(true)

    try {
      const res = await fetch('https://attendx-t48b.onrender.com/api/qrcode/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjectId,
          lectureId: formData.lectureId,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data?.message || 'Failed to generate QR code')
      }

      setQrCodeUrl(data.data)
      onSubmit({ ...formData, subjectId, qrCode: data.data })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate QR code.')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full animate-slide-up">

        <div className="bg-linear-to-r from-primary to-primary/60 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-foreground">Create New Lecture</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

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

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-xs text-primary font-medium">
              ✓ QR code will be automatically generated when you create the lecture
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {qrCodeUrl && (
            <div className="rounded-2xl border border-border p-4 bg-muted/70">
              <p className="text-sm font-semibold text-foreground mb-3">Generated QR Code</p>
              <div className="flex items-center justify-center">
                <img
                  src={qrCodeUrl}
                  alt="Lecture QR code"
                  className="w-40 h-40 object-contain rounded-lg bg-white p-2"
                />
              </div>
            </div>
          )}

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
              disabled={isGenerating}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? 'Generating QR...' : 'Create Lecture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
