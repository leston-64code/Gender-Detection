import React, { useRef, useEffect, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs';

const VideoInputHandler = () => {
    const [humanCount, setHumanCount] = useState(0);
    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);
    const webcamRef = useRef(null);
    const webcamCanvasRef = useRef(null);

    useEffect(() => {
        const initializeBackend = async () => {
            await tf.setBackend('webgl');
            await tf.ready();
        };

        const startWebcam = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcamRef.current.srcObject = stream;
            webcamRef.current.onloadedmetadata = () => {
                webcamRef.current.play();
                detectWebcam();
            };
        };

        const detectWebcam = async () => {
            await initializeBackend();
            const cocoSsdModel = await cocoSsd.load();
            const blazefaceModel = await blazeface.load();

            const detect = async () => {
                if (webcamRef.current && webcamRef.current.readyState === 4) {
                    const canvas = webcamCanvasRef.current;
                    const ctx = canvas.getContext('2d');
                    canvas.width = webcamRef.current.videoWidth;
                    canvas.height = webcamRef.current.videoHeight;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    const predictions = await cocoSsdModel.detect(webcamRef.current);
                    const humans = predictions.filter(prediction => prediction.class === 'person');
                    let localMaleCount = 0;
                    let localFemaleCount = 0;

                    for (let human of humans) {
                        const [x, y, width, height] = human.bbox;
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(x, y, width, height);

                        const facePredictions = await blazefaceModel.estimateFaces(webcamRef.current, false);
                        facePredictions.forEach(face => {
                            const faceBox = face.topLeft.concat(face.bottomRight);
                            if (
                                faceBox[0] >= x &&
                                faceBox[1] >= y &&
                                faceBox[2] <= x + width &&
                                faceBox[3] <= y + height
                            ) {
                                const isMale = Math.random() > 0.5; // Replace with actual gender detection logic
                                if (isMale) localMaleCount++;
                                else localFemaleCount++;
                            }
                        });
                    }

                    setHumanCount(humans.length);
                    setMaleCount(localMaleCount);
                    setFemaleCount(localFemaleCount);
                }
                requestAnimationFrame(detect);
            };

            detect();
        };

        startWebcam();
    }, []);

    return (
        <div style={{ position: 'relative', width: '640px', height: '480px' }}>
            <h2>Webcam Stream</h2>
            <video
                ref={webcamRef}
                width="640"
                height="480"
                autoPlay
                style={{ position: 'absolute', top: 0, left: 0 }}
            ></video>
            <canvas
                ref={webcamCanvasRef}
                width="640"
                height="480"
                style={{ position: 'absolute', top: 0, left: 0 }}
            ></canvas>
            <p className='absolute right-2 top-2'>Detected humans: {humanCount}</p>
            <p className='absolute right-2 top-6'>Males: {maleCount}</p>
            <p className='absolute right-2 top-10'>Females: {femaleCount}</p>
        </div>
    );
};

export default VideoInputHandler;
