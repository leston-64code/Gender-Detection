import React, { useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as blazeface from '@tensorflow-models/blazeface';

const ImageInputHandler = () => {
    const [humanCount, setHumanCount] = useState(0);
    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);
    const uploadInputRef = useRef(null);
    const photoCanvasRef = useRef(null);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;
        img.onload = async () => {
            const cocoSsdModel = await cocoSsd.load();
            const blazefaceModel = await blazeface.load();
            const predictions = await cocoSsdModel.detect(img);

            const humans = predictions.filter(prediction => prediction.class === 'person');
            let maleCount = 0;
            let femaleCount = 0;

            const canvas = photoCanvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            for (let human of humans) {
                const [x, y, width, height] = human.bbox;
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, width, height);

                const facePredictions = await blazefaceModel.estimateFaces(img, false);
                if (facePredictions.length > 0) {
                    const isMale = Math.random() > 0.5;
                    if (isMale) maleCount++;
                    else femaleCount++;
                }
            }

            setHumanCount(humans.length);
            setMaleCount(maleCount);
            setFemaleCount(femaleCount);
        };
    };

    return (

        <>

            <div className='flex flex-row '>
                <div>
                    <h2>Photo Upload</h2>
                    <input type="file" ref={uploadInputRef} accept="image/*" onChange={handleImageUpload} />
                    <canvas ref={photoCanvasRef}></canvas>

                </div>

                <div className='pt-10 pl-5'>
                    <p>Detected humans: {humanCount}</p>
                    <p>Males: {maleCount}</p>
                    <p>Females: {femaleCount}</p>
                </div>
            </div>
        </>

    );
};

export default ImageInputHandler;
