'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Upload, AlertCircle } from 'lucide-react'
import jsQR from 'jsqr'
import { store } from '@workspace/utils/store/zustand'
import { useShallow } from 'zustand/shallow'
import FaceAuth from './face-auth'

const BACKEND_URL = 'https://attendx-t48b.onrender.com'
// const BACKEND_URL = 'http://localhost:3000'

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

  return (
    <>
      {showFaceAuth && (
        <FaceAuth 
          onClose={handleCloseFaceAuth}
          onVerified={handleFaceVerified}
          isRegistering={false}
        />
      )}

      {!showFaceAuth && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-md border border-border overflow-hidden animate-slide-up">
            <div className="bg-linear-to-r from-primary to-primary/70 px-6 py-6 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Mark Attendance</h2>
                <p className="text-white/80 text-sm">Scan class QR code</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {!scannedResult ? (
                <div className="space-y-4">
                  {isVerifying && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-3 text-foreground">Verifying QR code...</span>
                    </div>
                  )}

                  {!isVerifying && (
                    <>
                      <div className="relative bg-black rounded-2xl overflow-hidden aspect-square">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <canvas
                          ref={canvasRef}
                          className="hidden"
                        />
                        <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-lg m-12" />
                        <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-primary/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-primary/30 to-transparent" />
                      </div>

                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="qr-upload"
                        />
                        <label
                          htmlFor="qr-upload"
                          className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-border rounded-xl p-3 cursor-pointer hover:border-primary/50 hover:bg-muted transition-all duration-300"
                        >
                          <Upload className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Or upload QR image</span>
                        </label>
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        Position the QR code within the frame to scan
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-center py-4">
                  {isMarking ? (
                    <>
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                      <p className="text-foreground">Marking attendance...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">Attendance Marked!</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          Class successfully marked as present
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Time: {new Date().toLocaleTimeString()}
                        </p>
                      </div>

                      <button
                        onClick={handleSuccess}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all duration-300"
                      >
                        Scan Another Class
                      </button>

                      <button
                        onClick={onClose}
                        className="w-full border border-border text-foreground font-bold py-3 rounded-xl hover:bg-muted transition-all duration-300"
                      >
                        Done
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}