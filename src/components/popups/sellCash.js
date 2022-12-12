import React from 'react';

const SellCash = ({
    isConnected,
    showGetBUSD,
    cash,
    cashAsBUSD,
    withdrawMoney,
    setShowGetBUSD,
}) => {
    return (
        <div className="popup-wrapper popup-sell sell-cash" style={{ display: showGetBUSD && isConnected ? "block" : "none" }}>
            <div className="popup-box-1">
                <div className="popup-sell-header">Get BUSD</div>
                <div className="popup-sell-rate-text">
                    0.005 BUSD For 100 <div className="popup-sell-rate-money-icon" />
                </div>
                <div className="popup-sell-figure"></div>
                <div className="popup-sell-description">
                    {`You can exchange `}
                    <span className="popup-sell-money-value">
                        {cash}
                        <div className="popup-sell-money-icon" />
                    </span>
                    {` for `}
                    <span className="popup-sell-currency-value">
                        {parseFloat(cashAsBUSD).toFixed(4)}BUSD
                    </span>
                </div>
                <button type="button" className="popup-sell-btn-swap" onClick={() => withdrawMoney()}>Exchange</button>
            </div>
            <button type="button" className="popup-btn-close" onClick={() => setShowGetBUSD(false)} />
        </div>
    )
}
export default SellCash;