'use client'

import { useState, useRef, useEffect } from 'react'
import { AlertCircle, CheckCircle, Camera, X } from 'lucide-react'
import { FaceRecognitionService } from '../../../face-recognition/service'

interface FaceRegistrationProps {
  onRegistrationComplete?: () => void
}

export default function FaceRegistration({ onRegistrationComplete }: FaceRegistrationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [permission, setPermission] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'face-detected' | 'processing' | 'saving' | 'success' | 'failed'>('idle')
  const [faceDetected, setFaceDetected] = useState(false)
  const [cameraInitializing, setCameraInitializing] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const faceServiceRef = useRef(new FaceRecognitionService())
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isProcessingRef = useRef(false)
  const scanStateRef = useRef(scanState)

  useEffect(() => {
    scanStateRef.current = scanState
  }, [scanState])

  const BACKEND_URL = 'http://localhost:3000'

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      event.preventDefault()
    }

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    checkFaceRegistration()
  }, [])

  const checkFaceRegistration = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${BACKEND_URL}/api/attendance/face/status`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      setIsRegistered(data?.isRegistered || false)
    } catch (err) {
      console.error('Error checking face registration:', err)
    }
  }

  const startCamera = async () => {
    setShowModal(true)

    try {
      setError(null)
      setCameraInitializing(true)
      console.log('FaceRegistration: Starting camera...')

      console.log('FaceRegistration: Loading face recognition models...')
      await faceServiceRef.current.loadModels()
      console.log('FaceRegistration: Models loaded successfully')

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Camera initialization timeout')), 10000)
      })

      const streamPromise = faceServiceRef.current.startVideoStream()
      const stream = await Promise.race([streamPromise, timeoutPromise]) as MediaStream

      console.log('FaceRegistration: Camera stream obtained')
      streamRef.current = stream
      setPermission(true)
      setScanState('scanning')
      setCameraInitializing(false)
      console.log('FaceRegistration: Permission set to true, scanState set to scanning')
    } catch (err) {
      setCameraInitializing(false)
      const errorMessage = err instanceof Error ? err.message : 'Unable to access camera. Please check permissions in your browser settings.'
      setError(errorMessage)
      setScanState('failed')
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }

  useEffect(() => {
    const videoElement = videoRef.current
    if (!permission || !videoElement || !streamRef.current) return

    const initVideo = async () => {
      try {
        videoElement.srcObject = streamRef.current
        videoElement.muted = true
        await videoElement.play()
        console.log('FaceRegistration: Video element set up and playing')
      } catch (err) {
        console.error('FaceRegistration: Video play failed:', err)
      }
    }

    initVideo()
    startScanning()

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [permission])

  const startScanning = () => {
    console.log('FaceRegistration: Starting face scanning interval')
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
    }

    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || scanStateRef.current !== 'scanning') {
        console.log('FaceRegistration: Skipping scan - videoRef:', !!videoRef.current, 'scanState:', scanStateRef.current)
        return
      }

      try {
        console.log('FaceRegistration: Attempting face detection...')
        const faceDescriptor = await faceServiceRef.current.captureDescriptorFromVideo(videoRef.current)
        if (faceDescriptor) {
          console.log('FaceRegistration: Face detected!')
          setFaceDetected(true)
          setScanState('face-detected')

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }

          if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current)
            scanIntervalRef.current = null
          }

          timeoutRef.current = setTimeout(() => {
            if (scanStateRef.current === 'face-detected') {
              console.log('FaceRegistration: Auto-capturing face after delay')
              handleRegisterFace(faceDescriptor)
            }
          }, 1000)
        } else {
          setFaceDetected(false)
        }
      } catch (err) {
        console.error('FaceRegistration: Face detection error:', err)
        setFaceDetected(false)
      }
    }, 500)
  }

  const handleRegisterFace = async (faceDescriptor?: Float32Array) => {
    if (isProcessingRef.current) {
      console.log('FaceRegistration: Already processing, skipping duplicate call')
      return
    }

    isProcessingRef.current = true
    console.log('FaceRegistration: Starting face registration processing')

    if (!videoRef.current || !permission) {
      setError('Camera access required to register face')
      setScanState('failed')
      setIsLoading(false)
      isProcessingRef.current = false
      return
    }

    setScanState('processing')
    setIsLoading(true)
    setError(null)

    try {
      let descriptor = faceDescriptor || null
      if (!descriptor) {
        descriptor = await faceServiceRef.current.captureDescriptorFromVideo(videoRef.current)
      }

      if (!descriptor) {
        setError('No face detected. Please position your face clearly in the frame and try again.')
        setScanState('failed')
        setIsLoading(false)
        isProcessingRef.current = false
        return
      }

      setScanState('saving')
      console.log('FaceRegistration: Face processing complete, saving to database')

      const token = localStorage.getItem('token')
      if (!token) {
        setError('Authentication required. Please sign in again.')
        setScanState('failed')
        setIsLoading(false)
        isProcessingRef.current = false
        return
      }

      const response = await fetch(`${BACKEND_URL}/api/attendance/face/register`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          faceEmbedding: Array.from(descriptor)
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data?.message || 'Failed to register face. Please try again.')
        setScanState('failed')
        setIsLoading(false)
        isProcessingRef.current = false
        return
      }

      console.log('FaceRegistration: Registration successful')
      setScanState('success')
      setSuccess(true)
      setIsRegistered(true)
      setTimeout(() => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
        setShowModal(false)
        onRegistrationComplete?.()
      }, 2000)
    } catch (err) {
      console.error('FaceRegistration: Registration error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setScanState('failed')
      setIsLoading(false)
    } finally {
      isProcessingRef.current = false
    }
  }

  const handleRetry = () => {
    console.log('FaceRegistration: Retrying face scan')
    setError(null)
    setScanState('scanning')
    setFaceDetected(false)
    setIsLoading(false)
    isProcessingRef.current = false

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (permission && videoRef.current) {
      startScanning()
    }
  }

  const stopCamera = () => {
    console.log('FaceRegistration: Stopping camera')
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setPermission(false)
    setScanState('idle')
    setFaceDetected(false)
    setIsLoading(false)
    isProcessingRef.current = false
  }

  const handleCloseModal = () => {
    stopCamera()
    setShowModal(false)
    setError(null)
  }

  useEffect(() => {
    return () => {
      console.log('FaceRegistration: Component cleanup')
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-card rounded-3xl shadow-2xl w-full max-w-md border border-border overflow-hidden animate-slide-up">
          <div className="bg-linear-to-r from-primary to-primary/70 px-6 py-6 text-white flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Register Your Face</h2>
              <p className="text-white/80 text-sm">Position your face in the frame to register</p>
            </div>
            <button
              onClick={handleCloseModal}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {success ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Face Registration Complete!</h3>
                  <p className="text-muted-foreground text-sm">
                    Your biometric data has been securely stored for attendance verification.
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all duration-300"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {error && scanState === 'failed' && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-lg flex gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="relative bg-black rounded-2xl overflow-hidden aspect-square">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-4 border-dashed border-primary/50 rounded-lg m-8" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-40 border-2 border-primary rounded-full opacity-30" />
                  </div>

                  {scanState === 'scanning' && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm font-medium">Scanning for face...</p>
                      </div>
                    </div>
                  )}

                  {scanState === 'face-detected' && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <div className="text-center text-white">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                        <p className="text-sm font-medium">Face detected! Processing...</p>
                      </div>
                    </div>
                  )}

                  {scanState === 'processing' && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="text-sm font-medium">Registering face...</p>
                      </div>
                    </div>
                  )}

                  {scanState === 'saving' && (
                    <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="text-sm font-medium">Saving to database...</p>
                      </div>
                    </div>
                  )}

                  {scanState === 'failed' && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                      <div className="text-center text-white">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                        <p className="text-sm font-medium">Registration failed</p>
                      </div>
                    </div>
                  )}
                </div>

                {scanState === 'failed' ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleRetry}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all duration-300"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="w-full border border-border text-foreground font-bold py-3 rounded-xl hover:bg-muted transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : scanState === 'scanning' ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      Position your face in the center of the frame
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Face will be automatically detected and registered
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleCloseModal}
                    className="w-full border border-border text-foreground font-bold py-3 rounded-xl hover:bg-muted transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isRegistered && !permission) {
    return (
      <div className="bg-card rounded-2xl shadow-lg border border-border p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-foreground">Face Already Registered</h3>
            <p className="text-sm text-muted-foreground">
              Your biometric data is ready for attendance verification. You can proceed to mark attendance using the QR scanner.
            </p>
          </div>
        </div>
        <button
          onClick={startCamera}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Update Face Registration
        </button>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-6 space-y-4">
      <div>
        <h3 className="font-bold text-lg text-foreground mb-2">Face Biometric Registration</h3>
        <p className="text-sm text-muted-foreground">
          Register your face for secure attendance verification. Only your face features are stored, never images.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {!permission ? (
        <button
          onClick={startCamera}
          disabled={cameraInitializing}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          {cameraInitializing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Initializing Camera...
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              Start Camera
            </>
          )}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-square">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-4 border-dashed border-primary/50 rounded-lg m-8" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-40 border-2 border-primary rounded-full opacity-30" />
            </div>

            {scanState === 'scanning' && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm font-medium">Scanning for face...</p>
                </div>
              </div>
            )}

            {scanState === 'face-detected' && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <p className="text-sm font-medium">Face detected! Processing...</p>
                </div>
              </div>
            )}

            {scanState === 'processing' && (
              <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm font-medium">Registering face...</p>
                </div>
              </div>
            )}

            {scanState === 'saving' && (
              <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm font-medium">Saving to database...</p>
                </div>
              </div>
            )}

            {scanState === 'failed' && (
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                  <p className="text-sm font-medium">Registration failed</p>
                </div>
              </div>
            )}
          </div>

          {scanState === 'failed' ? (
            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                Try Again
              </button>
              <button
                onClick={stopCamera}
                className="flex-1 border border-border text-foreground font-bold py-3 rounded-xl hover:bg-muted transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          ) : scanState === 'scanning' ? (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">
                Position your face in the center of the frame
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Face will be automatically detected and registered
              </p>
            </div>
          ) : (
            <button
              onClick={stopCamera}
              className="w-full border border-border text-foreground font-bold py-3 rounded-xl hover:bg-muted transition-all duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  )
}