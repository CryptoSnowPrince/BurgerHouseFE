import React from 'react';
// import React, { useEffect, useState } from 'react';
import { price } from "../../constant";

const UpgradeLevel = ({
    isConnected,
    houseId,
    timer,
    level,
    addedLevel,
    profit,
    addedProfit,
    totalProfit,
    disabled,
    upgradeHouse,
    enabled,
    setHouseId,
}) => {
    // const [blink, setBlink] = useState(true);

    // useEffect(() => {
    //     const intervalId1 = setInterval(() => {
    //         setBlink(prev => !prev);
    //     }, 500);

    //     return () => {
    //         clearInterval(intervalId1);
    //     };
    // }, []);

    return (
        <div className="popup-wrapper popup-upgrade upgrade-level" style={{ display: houseId > 0 && isConnected ? "block" : "none" }}>
            <div className="popup-box-2">
                <div className="popup-upgrade-header">House {houseId}</div>
                <div className="popup-upgrade-cover" />
                <div className="popup-upgrade-box">
                    <div className="popup-upgrade-mini-box">
                        <div className="popup-upgrade-mini-box-header">Level</div>
                        <div className="popup-upgrade-mini-box-text">
                            {level} / 5
                        </div>
                        <div className="popup-upgrade-mini-box-added">
                            {addedLevel}
                        </div>
                    </div>
                    <div className="popup-upgrade-mini-box">
                        <div className="popup-upgrade-mini-box-header">House Profit</div>
                        <div className="popup-upgrade-mini-box-text">
                            <span className="popup-upgrade-floor-profit">
                                {profit}
                            </span>
                            <div className="popup-upgrade-money-icon" />
                        </div>
                        <div className="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">
                            {addedProfit}
                        </div>
                    </div>
                    <div className="popup-upgrade-mini-box">
                        <div className="popup-upgrade-mini-box-header">Total Profit</div>
                        <div className="popup-upgrade-mini-box-text">
                            <span className="popup-upgrade-total-profit">{totalProfit}</span>
                            <div className="popup-upgrade-money-icon" />
                        </div>
                        <div className="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">
                            {addedProfit}
                        </div>
                    </div>
                </div>
                <div className="popup-upgrade-info-text">
                    {`House ${houseId} - `}
                    {enabled ?
                        (
                            parseInt(level) < 5 ?
                                `Upgrade to Level ${parseInt(level) + 1}` :
                                `Top Level !!!`
                        ) : `Upgrade to Level 1`}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className="btn-red btn-upgrade"
                        disabled={disabled}
                        onClick={(e) => upgradeHouse(e)}>
                        {enabled ? (
                            parseInt(level) < 5 ?
                                (
                                    timer !== "" ?
                                        <>
                                            <div className="popup-time-icon" />
                                            <div className="level-text-pop-up-timer" style={{ marginLeft: "1px" }}>
                                                {timer}
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="farm-coin" >&nbsp;</div>
                                            <div className="level-text-pop-up">
                                                {price[level + 5 * (houseId - 1)]}
                                            </div>
                                        </>
                                )
                                :
                                (
                                    <div style={{ fontWeight: "bold", fontSize: "16px", color: "yellow" }}>TOP LEVEL</div>
                                )
                        )
                            : (<div>--</div>)}
                    </button>
                </div>
            </div>
            <button type="button" className="popup-btn-close"
                style={{ marginTop: "-12px", marginLeft: "35px" }}
                onClick={() => setHouseId(0)} />
        </div>
    )
}
export default UpgradeLevel;