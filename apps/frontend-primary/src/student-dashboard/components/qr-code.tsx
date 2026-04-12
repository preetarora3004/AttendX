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
    return () => {
      console.log('QRScanner: Cleaning up QR scanning camera')
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
        videoRef.current.srcObject = null
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
      }
    }
  }, [isScanning, isFaceVerified])

  useEffect(() => {
    if (!isScanning || !isFaceVerified || !videoRef.current || !canvasRef.current) return

    scanIntervalRef.current = setInterval(() => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return

      const context = canvas.getContext('2d')
      if (!context) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        handleQRDetected(code.data)
      }
    }, 500)

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
      }
    }
  }, [isScanning, isFaceVerified])

  const handleQRDetected = async (qrData: string) => {
    setIsScanning(false)
    setIsVerifying(true)
    setError(null)

    const token = localStorage.getItem('token')
    if (!token) {
      setError('Authentication required. Please sign in again.')
      setIsVerifying(false)
      setIsScanning(true)
      return
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/qr/verify/${encodeURIComponent(qrData)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const result: QRVerifyResponse = await response.json()

      if (!result.success || !result.data) {
        setError(result.message || 'Invalid or expired QR code. Please try again.')
        setIsVerifying(false)
        setIsScanning(true)
        return
      }

      const lectureInfo = {
        token: result.data.token,
        lectureId: result.data.lectureId,
        subjectId: result.data.subjectId,
      }

      setScannedResult(lectureInfo)
      const marked = await markAttendance(result.data.lectureId)
      if (!marked) {
        setScannedResult(null)
        setIsScanning(true)
      }
      setIsVerifying(false)
    } catch (err) {
      setError('Failed to verify QR code. Please try again.')
      console.error('Error verifying QR:', err)
      setIsVerifying(false)
      setIsScanning(true)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = async () => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) return

        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0)

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          await handleQRDetected(code.data)
        } else {
          setError('No valid QR code found in the image.')
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const markAttendance = async (lectureId?: string) => {
    const finalLectureId = lectureId ?? scannedResult?.lectureId
    if (!finalLectureId || !student?.id) {
      setError('Missing required information to mark attendance.')
      return false
    }

    setIsMarking(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Authentication required. Please sign in again.')
        setIsMarking(false)
        return false
      }

      const response = await fetch(
        `${BACKEND_URL}/api/attendance/present-class/${finalLectureId}/${student.id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        setError(errorData?.message || errorData?.error || 'Failed to mark attendance. Please try again.')
        setIsMarking(false)
        return false
      }

      setTimeout(() => {
        onClose()
      }, 2000)
      
      return true
    } catch (err) {
      setError('Failed to mark attendance. Please try again.')
      console.error('Error marking attendance:', err)
      setIsMarking(false)
      return false
    }
  }

  const handleSuccess = () => {
    setScannedResult(null)
    setIsScanning(true)
    setError(null)
  }

  const handleRetry = () => {
    setScannedResult(null)
    setIsScanning(true)
    setError(null)
  }

  const handleFaceVerified = () => {
    setShowFaceAuth(false)
    setIsFaceVerified(true)
    setIsScanning(true)
  }

  const handleCloseFaceAuth = () => {
    setShowFaceAuth(false) 
  }