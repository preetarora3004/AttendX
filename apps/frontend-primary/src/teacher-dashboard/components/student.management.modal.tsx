'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

interface StudentManagementModalProps {
  isOpen: boolean
  onClose: () => void
  class: {
    id: string
    name: string
    code: string
    students: string[]
  }
  onAddStudent: (studentId: string) => void
  onRemoveStudent: (studentId: string) => void
}

export default function StudentManagementModal({
  isOpen,
  onClose,
  class: classItem,
  onAddStudent,
  onRemoveStudent,
}: StudentManagementModalProps) {
  const [newStudentId, setNewStudentId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const allStudents = [
    'S001', 'S002', 'S003', 'S004', 'S005', 'S006', 'S007', 'S008', 'S009', 'S010',
    'S011', 'S012', 'S013', 'S014', 'S015', 'S016', 'S017', 'S018', 'S019', 'S020',
  ]

  const availableStudents = allStudents.filter((s) => !classItem.students.includes(s))
  const filteredAvailable = availableStudents.filter((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddStudent = () => {
    if (newStudentId && !classItem.students.includes(newStudentId)) {
      onAddStudent(newStudentId)
      setNewStudentId('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-96 flex flex-col animate-slide-up">

        <div className="bg-linear-to-r from-primary to-primary/60 p-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-primary-foreground">{classItem.name}</h2>
            <p className="text-primary-foreground/80 text-sm">{classItem.code}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Add Student</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-foreground placeholder-muted-foreground"
              />
            </div>

            {searchTerm && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredAvailable.length > 0 ? (
                  filteredAvailable.map((student) => (
                    <button
                      key={student}
                      onClick={() => {
                        onAddStudent(student)
                        setSearchTerm('')
                      }}
                      className="w-full p-3 rounded-lg bg-muted hover:bg-muted/80 border border-border transition-all text-left flex items-center justify-between group"
                    >
                      <span className="font-semibold text-foreground">{student}</span>
                      <Plus className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-3 text-center">No available students</p>
                )}
              </div>
            )}

            {!searchTerm && availableStudents.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Type to search from {availableStudents.length} available student(s)
              </div>
            )}

            {availableStudents.length === 0 && (
              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
                <p className="text-sm text-secondary font-medium">All available students are already enrolled</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">
              Enrolled Students ({classItem.students.length})
            </h3>

            {classItem.students.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {classItem.students.map((student) => (
                  <div
                    key={student}
                    className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between group hover:bg-primary/10 transition-colors"
                  >
                    <span className="font-semibold text-foreground">{student}</span>
                    <button
                      onClick={() => onRemoveStudent(student)}
                      className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground">No students enrolled yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border p-6 flex shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
