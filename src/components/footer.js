import React from 'react';

const Footer = ({ isConnected, setShowGetMoney, loadWeb3Modal }) => {
    return (
        <>
            <div className="footer get-money">
                {isConnected ?
                    <button type="button" className="footer-btn btn-green"
                        onClick={() => setShowGetMoney(true)}>
                        Get Money
                    </button> :
                    <button type="button" className="footer-btn btn-green"
                        onClick={loadWeb3Modal}>
                        CONNECT
                    </button>
                }
            </div>
        </>
    )
}
export default Footer;