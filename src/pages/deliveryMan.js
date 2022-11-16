import React, { useEffect, useRef, useState } from 'react';
const DeliveryMan = ({ nSpeed }) => {
    const [step, setStep] = useState(0);
    const [walk, setWalk] = useState(0);

    const bike = useRef();

    useEffect(() => {
        const intervalId1 = setInterval(() => {
            setStep(prev => prev >= 19 ? 0 : prev + 1);
            setWalk(prev => prev > window.innerWidth ? 60 : prev + nSpeed);
        }, 100);

        return () => {
            clearInterval(intervalId1);
        };
    }, []);

    return (
        <div ref={bike}
            className={`delivery-man delivery-man-${step}`}
            style={{ left: `${walk}px` }}>
        </div>
    )
}
export default DeliveryMan;