import React from 'react';

const CollectMoney = ({
    isConnected,
    showGetMoney,
    pendingHours,
    pendingCash,
    collectMoney,
    setShowGetMoney,
}) => {
    return (
        <div className="popup-wrapper popup-profit collect-money" style={{ display: showGetMoney && isConnected ? "block" : "none" }}>
            <div className="popup-box-1">
                <div className="popup-profit-header" style={{ fontWeight: "bold" }}>Your Profit</div>
                <div className="popup-profit-time">
                    <div className="popup-profit-time-icon" />
                    <div className="popup-profit-time-text" style={{ fontWeight: "bold" }}>{pendingHours()} Hours</div>
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold" }} className="popup-profit-time-description">
                    Don't forget to collect profit every 24 hours
                </div>
                <div className="popup-profit-figure" />
                <div className="popup-profit-money-bar">
                    <div className="popup-profit-money-bar-icon" />
                    <div className="popup-profit-money-bar-text">{pendingCash()}</div>
                </div>
                <button type="button" className="btn-green" style={{ marginTop: "2px", fontWeight: "bold" }}
                    onClick={(e) => collectMoney(e)}
                >
                    Collect
                </button>
            </div>
            <button type="button" className="popup-btn-close" onClick={() => setShowGetMoney(false)} />
        </div>
    )
}
export default CollectMoney;