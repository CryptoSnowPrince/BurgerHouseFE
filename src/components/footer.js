import React, { useEffect } from 'react';

const Footer = ({ isConnected, setShowGetMoney, loadWeb3Modal }) => {

    useEffect(() => {
        window.scrollTo(0, 10000)
    }, [])

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