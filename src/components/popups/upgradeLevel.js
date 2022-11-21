import React from 'react';

const UpgradeLevel = ({
    isConnected,
    upgradeLevel,
    level,
    addedLevel,
    profit,
    addedProfit,
    totalProfit,
    disabled,
    upgradeHouse,
    enableValue,
    houseInfo,
    setUpgradeLevel,
    price,
}) => {
    return (
        <div className="popup-wrapper popup-upgrade upgrade-level" style={{ display: upgradeLevel > 0 && isConnected ? "block" : "none" }}>
            <div className="popup-box-2">
                <div className="popup-upgrade-header">House {upgradeLevel}</div>
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
                    {`House ${upgradeLevel} - `}
                    {enableValue() && upgradeLevel > 0 ?
                        (
                            parseInt(houseInfo.levels[upgradeLevel - 1]) < 5 ?
                                `Upgrade to Level ${parseInt(houseInfo.levels[upgradeLevel - 1]) + 1}` :
                                `Top Level !!!`
                        ) : `Upgrade to Level 1`}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className="btn-red btn-upgrade"
                        disabled={disabled}
                        onClick={(e) => upgradeHouse(e, upgradeLevel - 1)}>
                        {enableValue() && upgradeLevel > 0 ? (
                            parseInt(houseInfo.levels[upgradeLevel - 1]) < 5 ?
                                (
                                    <div className="farm-coin" style={{ fontWeight: "bold", marginLeft: "-12px", paddingLeft: "30px", paddingTop: "2px" }}>
                                        {price[parseInt(houseInfo.levels[upgradeLevel - 1])][upgradeLevel - 1]}
                                    </div>
                                )
                                :
                                (
                                    <div style={{ marginLeft: "-24px", fontWeight: "bold", fontSize: "16px" }}>TOP LEVEL</div>
                                )
                        )
                            : (<div>--</div>)}
                    </button>
                </div>
            </div>
            <button type="button" className="popup-btn-close"
                style={{ marginTop: "-12px", marginLeft: "35px" }}
                onClick={() => setUpgradeLevel(0)} />
        </div>
    )
}
export default UpgradeLevel;