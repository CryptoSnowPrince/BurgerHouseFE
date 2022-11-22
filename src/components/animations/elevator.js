import React, { useEffect, useState } from 'react';

const Elevator = ({ height, ropHeight, ropBottom }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setStep(prev => prev + 5)
        }, 60);
        return () => clearInterval(intervalId);
    }, [height]);

    const delta = parseInt((step / height) % 2) === 1 ? height * 2 - step % (height * 2) : step % height

    return (
        <>
            <div className="lift"
                style={{ bottom: `${delta}px` }}
            />
            <div className='lift-bar'
                style={{
                    bottom: `${delta + ropBottom}px`,
                    height: `${ropHeight - delta}px`
                }}
            />
            <div className='counter'>
                {/* <ParkingManager /> */}
            </div>
            <div className="logo-desktop" />
        </>
    )
}
export default Elevator;