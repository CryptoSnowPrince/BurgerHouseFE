import React from 'react';

const SellCash = ({
    isConnected,
    showGetBNB,
    cash,
    cashAsBNB,
    withdrawMoney,
    sellHouse,
    setShowGetBNB,
}) => {
    return (
        <div className="popup-wrapper popup-sell sell-cash" style={{ display: showGetBNB && isConnected ? "block" : "none" }}>
            <div className="popup-box-1">
                <div className="popup-sell-header">Get BNB</div>
                <div className="popup-sell-rate-text">
                    0.00002 BNB For 100 <div className="popup-sell-rate-money-icon" />
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
                        {cashAsBNB}BNB
                    </span>
                </div>
                <button type="button" className="popup-sell-btn-swap" onClick={() => withdrawMoney()}>Exchange</button>
                <button type="button" className="popup-sell-btn-destroy" onClick={() => sellHouse()}>Sell House</button>
            </div>
            <button type="button" className="popup-btn-close" onClick={() => setShowGetBNB(false)} />
        </div>
    )
}
export default SellCash;