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