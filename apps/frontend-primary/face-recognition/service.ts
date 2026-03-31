import faceApi from 'face-api.js'

export class Service {
    async loadModels() {
        const model_url = "/models"
        Promise.all([faceApi.nets.faceLandmark68Net.loadFromUri(model_url),
        faceApi.nets.tinyFaceDetector.loadFromUri(model_url)
        ]);
    }

    async getDescriptor() {
        const img = "/assets"
        const descriptor = await faceApi.detectSingleFace(img, new faceApi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor()

        if (!descriptor || descriptor.descriptor.length === 0) return false;

        return descriptor.descriptor;
    }

    async compareDescriptor(video: HTMLVideoElement, referenceDescriptor: Array<Float32Array>) {

        const faceMatcher = new faceApi.FaceMatcher(referenceDescriptor, 0.6);
        const interval = setInterval(async () => {
            if (!video || video.paused || video.ended) return;

            const detection = await faceApi.detectSingleFace(video, new faceApi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor()
            
            if(!detection) return;

            const result = faceMatcher.findBestMatch(detection.descriptor);   
        }, 200);

    }

    async startVideo() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        })
        return stream;
    }
}