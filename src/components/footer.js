import React from 'react';

import ParkingManager from "./animations/parkingManager";
import DeliveryMan from "./animations/deliveryMan";

const Footer = ({ isConnected, setShowGetMoney, loadWeb3Modal }) => {
    return (
        <>
            <div className="footer floor-0-background">
                <div className="floor-0-parking-pos">
                    <ParkingManager />
                    <div className="floor-0-brick-wall"></div>
                    <div className="floor-0-roof"></div>
                    <DeliveryMan nSpeed={5} />
                </div>
            </div>
            <div className="get-money">
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