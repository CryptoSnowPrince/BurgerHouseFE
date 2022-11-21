import React, { useEffect, useRef, useState } from 'react';

const DeliveryMan = ({ nSpeed }) => {
    const [step, setStep] = useState(0);
    const [walk, setWalk] = useState(0);

    const bike = useRef();

    useEffect(() => {
        const intervalId1 = setInterval(() => {
            setStep(prev => prev >= 19 ? 0 : prev + 1);
            setWalk(prev => prev > window.innerWidth ? window.innerWidth / 2 : prev + nSpeed);
        }, 60);

        return () => {
            clearInterval(intervalId1);
        };
    }, [nSpeed]);

    return (
        <div ref={bike}
            className={`delivery-man delivery-man-${step}`}
            // style={{ left: `${walk}px` }}
            style={{ left: window.innerWidth / 2 }}
        >
        </div>
    )
}
export default DeliveryMan;