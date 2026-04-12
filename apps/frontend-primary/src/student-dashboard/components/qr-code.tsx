'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Upload, AlertCircle } from 'lucide-react'
import jsQR from 'jsqr'
import { store } from '@workspace/utils/store/zustand'
import { useShallow } from 'zustand/shallow'
import FaceAuth from './face-auth'

// const BACKEND_URL = 'https://attendx-t48b.onrender.com'
const BACKEND_URL = 'http://localhost:3000'

interface QRScannerProps {
  onClose: () => void
}

interface QRVerifyResponse {
  success: boolean
  data?: {
    token: string
    lectureId: string
    subjectId: string
  }
  message?: string
}

interface LectureInfo {
  token: string
  lectureId: string
  subjectId: string
  subjectName?: string
}

export default function QRScanner({ onClose }: QRScannerProps) {
  const [scannedResult, setScannedResult] = useState<LectureInfo | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isFaceVerified, setIsFaceVerified] = useState(false)
  const [showFaceAuth, setShowFaceAuth] = useState(true)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMarking, setIsMarking] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { student } = store(
    useShallow((s) => ({
      student: s.student,
    }))
  )

  useEffect(() => {
    if (!isScanning || !isFaceVerified) return

    const startCamera = async () => {
      try {
        console.log('QRScanner: Starting camera for QR scanning')
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.muted = true
          await videoRef.current.play()
          console.log('QRScanner: Camera started for QR scanning')
        }
      } catch (err) {
        console.error('QRScanner: Error accessing camera:', err)
        setError('Unable to access camera. Please check permissions.')
      }
    }

    startCamera()