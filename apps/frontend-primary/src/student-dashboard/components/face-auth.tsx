'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { FaceRecognitionService } from '../../../face-recognition/service'

interface FaceAuthProps {
  onClose: () => void
  onVerified: () => void
  isRegistering?: boolean
}

export default function FaceAuth({ onClose, onVerified, isRegistering = false }: FaceAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [permission, setPermission] = useState(false)
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'face-detected' | 'processing' | 'success' | 'failed'>('idle')
  const [faceDetected, setFaceDetected] = useState(false)
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

  const BACKEND_URL = 'https://attendx-t48b.onrender.com'
// const BACKEND_URL = 'http://localhost:3000'

  const startScanning = () => {
    console.log('FaceAuth: Starting face scanning')
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
    }

    scanIntervalRef.current = setInterval(async () => {
      if (scanStateRef.current !== 'scanning' || isProcessingRef.current) return

      try {
        const descriptor = await faceServiceRef.current.captureDescriptorFromVideo(videoRef.current!)
        if (descriptor) {
          console.log('FaceAuth: Face detected during scanning')
          setFaceDetected(true)
          setScanState('face-detected')
          if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current)
            scanIntervalRef.current = null
          } 
          setTimeout(() => {
            handleCaptureFace(descriptor)
          }, 1000)
        }
      } catch (err) {
        console.error('FaceAuth: Error during scanning:', err)
      }
    }, 1000) 

    timeoutRef.current = setTimeout(() => {
      console.log('FaceAuth: Scanning timeout reached')
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
        scanIntervalRef.current = null
      }
      if (scanStateRef.current === 'scanning') {
        setError('No face detected within time limit. Please try again.')
        setScanState('failed')
      }
    }, 4000)
  }

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
    const startCamera = async () => {
      try {
        console.log('FaceAuth: Starting camera initialization...')
        setError(null)
        setScanState('idle')

        console.log('FaceAuth: Loading face recognition models...')
        await faceServiceRef.current.loadModels()
        console.log('FaceAuth: Models loaded successfully')

        const stream = await faceServiceRef.current.startVideoStream()
        console.log('FaceAuth: Camera stream obtained')

        streamRef.current = stream
        setPermission(true)
        setScanState('scanning')
        console.log('FaceAuth: Camera initialization complete, starting scan')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unable to access camera. Please check permissions.'
        setError(errorMessage)
        setScanState('failed')

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }
    }

    startCamera()

    return () => {
      console.log('FaceAuth: Cleaning up camera resources')
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

  useEffect(() => {
    const videoElement = videoRef.current
    if (!permission || !videoElement || !streamRef.current) return

    const initVideo = async () => {
      try {
        videoElement.srcObject = streamRef.current
        videoElement.muted = true
        await videoElement.play()
        console.log('FaceAuth: Video element set up and playing')
      } catch (err) {
        console.error('FaceAuth: Video play failed:', err)
      }
    }

    initVideo()
    console.log('FaceAuth: Video ready, starting scanning')
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

  const handleCaptureFace = async (faceDescriptor?: Float32Array) => {
    if (isProcessingRef.current) {
      console.log('FaceAuth: Already processing, skipping duplicate call')
      return
    }

    isProcessingRef.current = true
    console.log('FaceAuth: Starting face capture processing')

    if (!videoRef.current || !permission) {
      setError('Camera access required')
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
        setError('No face detected. Please position your face clearly in the frame.')
        setScanState('failed')
        setIsLoading(false)
        isProcessingRef.current = false
        return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        setError('Authentication required. Please sign in again.')
        setScanState('failed')
        setIsLoading(false)
        isProcessingRef.current = false
        return
      }

      const endpoint = isRegistering ? '/api/attendance/face/register' : '/api/attendance/face/verify'
      console.log(`FaceAuth: Making API call to ${endpoint}`)
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
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
        setError(data?.message || (isRegistering ? 'Failed to register face' : 'Face verification failed'))
        setScanState('failed')
        setIsLoading(false)
        isProcessingRef.current = false
        return
      }

      if (!isRegistering && !data.verified) {
        setError('Face does not match. Please try again.')
        setScanState('failed')
        setIsLoading(false)
        isProcessingRef.current = false
        return
      }

      console.log('FaceAuth: Processing successful')
      setScanState('success')
      setSuccess(true)
      setTimeout(() => {
        onVerified()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setScanState('failed')
      setIsLoading(false)
    } finally {
      isProcessingRef.current = false
    }
  }

  const handleRetry = () => {
    console.log('FaceAuth: Retrying face scan')
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

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl shadow-2xl w-full max-w-md border border-border overflow-hidden animate-slide-up">
          <div className="bg-linear-to-r from-primary to-primary/70 px-6 py-6 text-white flex items-center justify-between">
            <h2 className="text-xl font-bold">{isRegistering ? 'Face Registered' : 'Face Verified'}</h2>
          </div>
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-foreground">
              {isRegistering 
                ? 'Your face has been successfully registered.'
                : 'Your face has been verified. Proceeding...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (scanState === 'failed' && !permission) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl shadow-2xl w-full max-w-md border border-border overflow-hidden animate-slide-up">
          <div className="bg-linear-to-r from-red-500 to-red-600 px-6 py-6 text-white flex items-center justify-between">
            <h2 className="text-xl font-bold">Camera Failed</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="text-foreground mb-4">
                {error || 'Unable to access camera. Please check permissions and try again.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-2xl w-full max-w-md border border-border overflow-hidden animate-slide-up">
        <div className="bg-linear-to-r from-primary to-primary/70 px-6 py-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{isRegistering ? 'Register Your Face' : 'Verify Your Face'}</h2>
            <p className="text-white/80 text-sm">
              {isRegistering 
                ? 'Position your face in the frame for registration'
                : 'Position your face in the frame for verification'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && scanState === 'failed' && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {!permission ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-8 h-8 text-primary animate-spin" />
              <span className="ml-3 text-foreground">Initializing camera...</span>
            </div>
          ) : (
            <>
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

                {/* Scan state overlay */}
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
                      <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm font-medium">{isRegistering ? 'Registering face...' : 'Verifying face...'}</p>
                    </div>
                  </div>
                )}

                {scanState === 'failed' && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                      <p className="text-sm font-medium">Scan failed</p>
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
                    onClick={onClose}
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
                    Face will be automatically detected and processed
                  </p>
                </div>
              ) : (
                <button
                  onClick={onClose}
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