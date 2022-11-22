import React from 'react';

const LeftPanel = ({
    isConnected,
    curAcount,
    coins,
    cash,
    yieldValue,
    setShowBuyCoins,
    setShowGetBUSD,
    setShowReferral,
    /* logoutOfWeb3Modal */
}) => {
    return (
        <div className="menu-fixed-left">
            <div className="menu-bars">
                {
                    isConnected && <div className="menu-bar menu-bar-wallet">
                        <div className="menu-bar-value menu-bar-value-wallet">{`${curAcount.toString().substr(0, 6)}...${curAcount.toString().substr(38, 41)}`}</div>
                    </div>
                }
                <div className="menu-bar menu-bar-coin">
                    <div className="menu-bar-value">{coins}</div>
                    <button type="button" className="menu-bar-btn plus" disabled={!isConnected} onClick={() => setShowBuyCoins(true)} />
                </div>
                <div className="menu-bar menu-bar-money">
                    <div className="menu-bar-value">{cash}</div>
                    <button type="button" className="menu-bar-btn minus" disabled={!isConnected} onClick={() => setShowGetBUSD(true)} />
                </div>
                <div className="menu-bar menu-bar-without-background">
                    <div className="menu-bar-value">{parseInt(yieldValue)/10}/h</div>
                </div>
            </div>
            <div className="menu-btns">
                <button className="menu-btn referral"
                    style={{ marginBottom: "12px" }}
                    onClick={() => setShowReferral(true)}
                    data-bs-placement="right"
                    data-bs-toggle="tooltip"
                    title="Partners" />
                <a href="https://t.me/red1ones" target="_blank" rel="noreferrer">
                    <button className="menu-btn telegram" data-bs-placement="right" data-bs-toggle="tooltip" title="Telegram">
                    </button>
                </a>
                {/* <a href="https://t.me/red1ones" target="_blank" rel="noreferrer">
                    <button className="menu-btn menu-btn-transactions" data-bs-placement="right" data-bs-toggle="tooltip" title="Help">
                        <i className="fa fa-question"></i>
                    </button>
                </a>
                {
                    isConnected &&
                    <button className="menu-btn menu-btn-logout" data-bs-placement="right" data-bs-toggle="tooltip" title="Logout"
                        onClick={logoutOfWeb3Modal} >
                        <i className="fa fa-sign-out"></i>
                    </button>
                } */}
            </div>
        </div >
    )
}
export default LeftPanel;