import React, { useEffect, useState } from 'react';
import { secondsToHMS } from '../../utils/util';

const ComingSoon = ({
    isComingSoon,
    setIsComingSoon,
    leftTime,
}) => {
    const [countTime, setCountTime] = useState(leftTime)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountTime(prev => prev - 1)
        }, 1000);

        return () => {
            clearInterval(intervalId);
            setCountTime(leftTime)
        };
    }, [leftTime]);

    return (
        <div className="popup-wrapper coming-soon" style={{ display: isComingSoon ? "block" : "none" }}>
            <div className="popup-box-1">
                <div className="popup-coming-soon-header">Coming Soon!</div>
                <div className="logo-coming-soon" />
                <div className="popup-coming-soon-comment">
                    Burger House is coming to you!
                </div>
                <div className="popup-coming-soon-timer">
                    {secondsToHMS(countTime > 864000 ? 864000 : countTime)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: "2px" }}>
                    <button className="btn-green" style={{ fontWeight: "bold" }}
                        onClick={() => setIsComingSoon(false)}
                    >
                        CLOSE
                    </button>
                </div>
            </div>
            <button type="button" className="popup-btn-close popup-btn-close-3" onClick={() => setIsComingSoon(false)} />
        </div >
    )
}
export default ComingSoon;