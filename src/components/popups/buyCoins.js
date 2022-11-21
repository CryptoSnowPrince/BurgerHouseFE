import React from 'react';

const BuyCoins = ({
    GAS_AMOUNT,
    BNB_PRICE,
    COIN_PRICE,
    isConnected,
    userBalance,
    bnbInputValue,
    setBnbInputValue,
    coinInputValue,
    setCoinInputValue,
    showBuyCoins,
    setShowBuyCoins,
    pendingTx,
    addCoins,
}) => {
    return (
        <div className="popup-wrapper popup-buy popup-exchange buy-coins" style={{ display: showBuyCoins && isConnected ? "block" : "none" }}>
            <div className="popup-box-1">
                <div className="popup-buy-header">Purchase Of Coins</div>
                <div className="popup-buy-text-container">
                    <div className="popup-buy-text-ticker">
                        <div className="popup-buy-currency-icon"></div>
                        BNB
                    </div>
                    <div className="popup-buy-text-balance" style={{ fontWeight: "bold" }}
                        onClick={() => {
                            const bnbVaule = (parseFloat(userBalance) - GAS_AMOUNT).toFixed(4)
                            setBnbInputValue(bnbVaule)
                            setCoinInputValue(parseInt(parseFloat(bnbVaule) * BNB_PRICE))
                        }}>
                        Balance: {parseFloat(userBalance).toFixed(3)}
                    </div>
                </div>
                <div className="popup-buy-input-wrapper">
                    <input style={{ fontSize: "20px" }} name="coin" className="popup-buy-input popup-buy-input-coin"
                        type="number" inputmode="decimal" placeholder="0.0" min="0"
                        value={bnbInputValue}
                        onChange={(e) => {
                            setBnbInputValue(e.target.value)
                            setCoinInputValue(parseInt(parseFloat(e.target.value) * BNB_PRICE))
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
                        type="number" inputmode="decimal" placeholder="0" min="0"
                        value={coinInputValue}
                        onChange={(e) => {
                            setCoinInputValue(parseInt(e.target.value))
                            setBnbInputValue((parseInt(e.target.value) / BNB_PRICE).toFixed(5))
                        }}
                    />
                </div>
                <div className="popup-buy-text-ticker" style={{ marginTop: "16px" }}>
                    {COIN_PRICE} BNB For 1 COIN
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: "20px" }}>
                    <button className="btn-green" style={{ fontWeight: "bold" }}
                        disabled={pendingTx || !isConnected}
                        onClick={addCoins}>
                        Buy
                    </button>
                </div>
            </div>
            <button type="button" className="popup-btn-close popup-btn-close-3" onClick={() => setShowBuyCoins(false)} />
        </div>
    )
}
export default BuyCoins;