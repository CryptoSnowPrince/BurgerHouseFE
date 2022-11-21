import React from 'react';

const LeftPanel = ({ isConnected, curAcount, coins, cash, yieldValue, setShowBuyCoins, setShowGetBNB, setShowReferral, logoutOfWeb3Modal }) => {
    return (
        <div className="menu-fixed-left">
            <div className="menu-bars">
                {
                    isConnected && <div className="menu-bar">
                        <div className="menu-bar-wallet">
                            <i className="fa fa-wallet" style={{ color: "#e6a71e", marginTop: "-9px" }}></i>
                        </div>
                        <div className="menu-bar-value menu-bar-value-wallet">{`${curAcount.toString().substr(0, 6)}...${curAcount.toString().substr(38, 41)}`}</div>
                    </div>
                }
                <div className="menu-bar">
                    <div className="menu-bar-coin"></div>
                    <div className="menu-bar-value">{coins}</div>
                    <button type="button" className="menu-bar-btn-plus" disabled={!isConnected} onClick={() => setShowBuyCoins(true)} />
                </div>
                <div className="menu-bar fc-bar">
                    <div className="menu-bar-money"></div>
                    <div className="menu-bar-value">{cash}</div>
                    <button type="button" className="menu-bar-btn-minus" disabled={!isConnected} onClick={() => setShowGetBNB(true)} />
                </div>
                <div className="menu-bar menu-bar-without-background">
                    <div className="menu-bar-value">{yieldValue}/h</div>
                </div>
            </div>
            <div className="menu-btns">
                <button className="menu-btn menu-btn-affiliate"
                    onClick={() => setShowReferral(true)}
                    data-bs-placement="right"
                    data-bs-toggle="tooltip"
                    title="Partners">
                    <i className="fa fa-users"></i>
                </button>
                <a href="https://t.me/red1ones" target="_blank" rel="noreferrer">
                    <button className="menu-btn menu-btn-leaderboard" data-bs-placement="right" data-bs-toggle="tooltip" title="Telegram">
                        <svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="3 5 50 50" width="30px" height="30px"><path d="M46.137,6.552c-0.75-0.636-1.928-0.727-3.146-0.238l-0.002,0C41.708,6.828,6.728,21.832,5.304,22.445	c-0.259,0.09-2.521,0.934-2.288,2.814c0.208,1.695,2.026,2.397,2.248,2.478l8.893,3.045c0.59,1.964,2.765,9.21,3.246,10.758	c0.3,0.965,0.789,2.233,1.646,2.494c0.752,0.29,1.5,0.025,1.984-0.355l5.437-5.043l8.777,6.845l0.209,0.125	c0.596,0.264,1.167,0.396,1.712,0.396c0.421,0,0.825-0.079,1.211-0.237c1.315-0.54,1.841-1.793,1.896-1.935l6.556-34.077	C47.231,7.933,46.675,7.007,46.137,6.552z M22,32l-3,8l-3-10l23-17L22,32z"></path></svg>
                    </button>
                </a>
                {/* <a href="https://t.me/red1ones" target="_blank" rel="noreferrer">
              <button className="menu-btn menu-btn-transactions" data-bs-placement="right" data-bs-toggle="tooltip" title="Help">
                <i className="fa fa-question"></i>
              </button>
            </a> */}
                {
                    isConnected &&
                    <button className="menu-btn menu-btn-logout" data-bs-placement="right" data-bs-toggle="tooltip" title="Logout"
                        onClick={logoutOfWeb3Modal} >
                        <i className="fa fa-sign-out"></i>
                    </button>
                }
            </div>
        </div>
    )
}
export default LeftPanel;