import React, { useEffect, useState } from 'react';

const ParkingManager = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setStep(prev => prev >= 39 ? 0 : prev + 1);
        }, 70);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={`parking-manager parking-manager-${step}`} />
    )
}
export default ParkingManager;