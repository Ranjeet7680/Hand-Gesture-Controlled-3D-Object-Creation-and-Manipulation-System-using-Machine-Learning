import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export class HandTracker {
    constructor() {
        this.hands = null;
        this.camera = null;
    }

    initialize(videoElement, onResults) {
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        this.hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.hands.onResults(onResults);

        if (videoElement) {
            this.camera = new Camera(videoElement, {
                onFrame: async () => {
                    await this.hands.send({ image: videoElement });
                },
                width: 1280,
                height: 720
            });
        }
    }

    start() {
        if (this.camera) {
            this.camera.start();
        }
    }

    stop() {
        if (this.camera) {
            this.camera.stop();
        }
    }
}
