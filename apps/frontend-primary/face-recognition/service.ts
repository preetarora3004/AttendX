import * as faceApi from 'face-api.js'

export class FaceRecognitionService {
    private modelsLoaded = false

    async loadModels() {
        if (this.modelsLoaded) return
        console.log('Loading face recognition models...')
        const model_url = "/models"
        try {
            const loadPromise = Promise.all([
                faceApi.nets.faceLandmark68Net.loadFromUri(model_url),
                faceApi.nets.tinyFaceDetector.loadFromUri(model_url)
            ])

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Model loading timeout')), 15000)
            })

            await Promise.race([loadPromise, timeoutPromise])
            this.modelsLoaded = true
            console.log('Face recognition models loaded successfully')
        } catch (error) {
            console.error('Failed to load face recognition models:', error)
            this.modelsLoaded = false
            throw new Error(`Failed to load face recognition models: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    async captureDescriptorFromImage(imagePath: string): Promise<Float32Array | null> {
        await this.loadModels()
        const img = new Image()
        img.src = imagePath
        
        return new Promise((resolve) => {
            img.onload = async () => {
                try {
                    const detection = await faceApi.detectSingleFace(img, new faceApi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceDescriptor()
                    
                    if (!detection || !detection.descriptor || detection.descriptor.length === 0) {
                        resolve(null)
                        return
                    }
                    resolve(detection.descriptor)
                } catch (err) {
                    console.error('Error capturing descriptor from image:', err)
                    resolve(null)
                }
            }
            img.onerror = () => resolve(null)
        })
    }

    async captureDescriptorFromVideo(video: HTMLVideoElement): Promise<Float32Array | null> {
        await this.loadModels()
        
        try {
            console.log('Attempting face detection from video...')
            const detections = await faceApi.detectAllFaces(video, new faceApi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors()
            
            if (!detections.length) {
                console.log('No faces detected')
                return null
            }
            
            if (detections.length > 1) {
                console.log('Multiple faces detected - rejecting')
                throw new Error('Exactly one face must be visible')
            }
            
            const detection = detections[0]
            if (detection.detection.score < 0.7) {
                console.log('Face detection score too low:', detection.detection.score)
                return null
            }
            
            if (!detection.descriptor || detection.descriptor.length === 0) {
                console.log('No valid descriptor found')
                return null
            }
            
            console.log('Face detected successfully, descriptor length:', detection.descriptor.length, 'score:', detection.detection.score)
            return detection.descriptor
        } catch (err) {
            console.error('Error capturing descriptor from video:', err)
            return null
        }
    }

    async verifyFace(video: HTMLVideoElement, referenceDescriptor: number[] | Float32Array): Promise<boolean> {
        await this.loadModels()
        
        try {
            const detection = await faceApi.detectSingleFace(video, new faceApi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor()
            
            if (!detection || !detection.descriptor) {
                return false
            }

            const threshold = 0.6
            const distance = this.euclideanDistance(detection.descriptor, referenceDescriptor)
            return distance < threshold
        } catch (err) {
            console.error('Error verifying face:', err)
            return false
        }
    }

    private euclideanDistance(descriptor1: Float32Array | number[], descriptor2: Float32Array | number[]): number {
        let sum = 0
        for (let i = 0; i < descriptor1.length; i++) {
            const diff = descriptor1[i] - descriptor2[i]
            sum += diff * diff
        }
        return Math.sqrt(sum)
    }

    async startVideoStream(): Promise<MediaStream> {
        try {
            const constraints = {
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            }

            const streamPromise = navigator.mediaDevices.getUserMedia(constraints)
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Camera access timeout')), 10000)
            })

            const stream = await Promise.race([streamPromise, timeoutPromise])
            console.log('Camera stream obtained successfully')
            return stream
        } catch (error) {
            console.error('Failed to access camera:', error)
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError') {
                    throw new Error('Camera access denied. Please allow camera permissions and try again.')
                } else if (error.name === 'NotFoundError') {
                    throw new Error('No camera found. Please connect a camera and try again.')
                } else if (error.name === 'NotReadableError') {
                    throw new Error('Camera is already in use by another application.')
                } else if (error.message === 'Camera access timeout') {
                    throw new Error('Camera access timed out. Please try again.')
                }
            }
            throw new Error(`Failed to access camera: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}