'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Upload } from 'lucide-react'

interface QRScannerProps {
  onClose: () => void
}

export default function QRScanner({ onClose }: QRScannerProps) {
  const [scannedResult, setScannedResult] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isScanning) return

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [isScanning])

  const handleScan = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
    
    setScannedResult('CS101-2024-03-11-10:30:00')
    setIsScanning(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setScannedResult('CS101-2024-03-11-10:30:00')
        setIsScanning(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSuccess = () => {
    setScannedResult(null)
    setIsScanning(true)
  }

  return (
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
          {!scannedResult ? (
            <div className="space-y-4">
            
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
                  width={300}
                  height={300}
                />
                <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-lg m-12" />
                <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-primary/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-primary/30 to-transparent" />
              </div>

              <button
                onClick={handleScan}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                Capture QR Code
              </button>

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
            </div>
          ) : (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Attendance Marked!</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Class: <span className="font-semibold text-foreground">Data Structures (CS101)</span>
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
