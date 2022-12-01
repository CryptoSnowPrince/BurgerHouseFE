import React from 'react';

const BuyCoins = ({
    BUSD_PRICE,
    COIN_PRICE,
    isConnected,
    busdBalance,
    busdInputValue,
    setBusdInputValue,
    userApprovedAmount,
    coinInputValue,
    setCoinInputValue,
    showBuyCoins,
    setShowBuyCoins,
    pendingTx,
    addCoins,
    approve
}) => {
    return (
        <div className="popup-wrapper popup-buy popup-exchange buy-coins" style={{ display: showBuyCoins && isConnected ? "block" : "none" }}>
            <div className="popup-box-1">
                <div className="popup-buy-header">Purchase Of Coins</div>
                <div className="popup-buy-text-container">
                    <div className="popup-buy-text-ticker">
                        <div className="popup-buy-currency-icon"></div>
                        BUSD
                    </div>
                    <div className="popup-buy-text-balance" style={{ fontWeight: "bold" }}
                        onClick={() => {
                            const busdValue = parseFloat(busdBalance).toFixed(3)
                            setBusdInputValue(busdValue)
                            setCoinInputValue(parseInt(parseFloat(busdValue) * BUSD_PRICE))
                        }}>
                        {parseFloat(busdBalance).toFixed(2)} BUSD
                    </div>
                </div>
                <div className="popup-buy-input-wrapper">
                    <input style={{ fontSize: "20px" }} name="coin" className="popup-buy-input popup-buy-input-coin"
                        type="number" inputMode="decimal" placeholder="0.0" min="0"
                        value={busdInputValue}
                        onChange={(e) => {
                            setBusdInputValue(e.target.value)
                            setCoinInputValue(parseInt(parseFloat(e.target.value) * BUSD_PRICE))
                        }}
                    />
                </div>
                <div className="popup-buy-arrow" style={{ marginTop: "10px" }}>
                    <i className="fa fa-arrow-down"></i>
                </div>
                <div className="popup-buy-text-container" style={{ marginTop: "0px" }}>
                    <div className="popup-buy-text-ticker">
                        <div className="popup-buy-coin-icon"></div>
                        COIN
                    </div>
                </div>
                <div className="popup-buy-input-wrapper">
                    <input style={{ fontSize: "20px" }} className="popup-buy-input popup-buy-input-cash"
                        type="number" inputMode="decimal" placeholder="0" min="0"
                        value={coinInputValue}
                        onChange={(e) => {
                            setCoinInputValue(parseInt(e.target.value))
                            setBusdInputValue((parseInt(e.target.value) / BUSD_PRICE).toFixed(3))
                        }}
                    />
                </div>
                <div className="popup-buy-text-ticker" style={{ marginTop: "10px" }}>
                    {COIN_PRICE} BUSD For 1 COIN
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: "10px" }}>
                    <button className="btn-green" style={{ fontWeight: "bold" }}
                        disabled={pendingTx || !isConnected}
                        onClick={
                            Number.isNaN(parseFloat(busdInputValue)) ||
                                parseFloat(userApprovedAmount) >= parseFloat(busdInputValue) ?
                                addCoins : approve
                        }
                    >
                        {
                            Number.isNaN(parseFloat(busdInputValue)) ||
                                parseFloat(userApprovedAmount) >= parseFloat(busdInputValue) ? 'BUY' : 'APPROVE'
                        }
                    </button>
                </div>
            </div>
            <button type="button" className="popup-btn-close popup-btn-close-3" onClick={() => setShowBuyCoins(false)} />
        </div >
    )
}
export default BuyCoins;