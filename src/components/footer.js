import React from 'react';

import ParkingManager from "./animations/parkingManager";
import DeliveryMan from "./animations/deliveryMan";

const Footer = ({ isConnected, setShowGetMoney, loadWeb3Modal }) => {
    return (
        <div className='footer'>
            <div class="floor-0-background" style={{ overflow: "hidden" }} >
                <div class="floor-0-parking-pos">
                    <ParkingManager />
                    <div class="floor-0-brick-wall"></div>
                    <div class="floor-0-roof"></div>
                    <DeliveryMan nSpeed={5} />
                </div>
            </div>
            <div className="bg-ground-my-bottom"></div>
            <div className="get-money">
                {isConnected ?
                    <button type="button" className="btn-green"
                        style={{ fontWeight: "bold" }}
                        onClick={() => setShowGetMoney(true)}>
                        Get Money
                    </button> :
                    <button type="button" className="btn-green btn-login" style={{ fontWeight: "bold" }}
                        onClick={loadWeb3Modal}>
                        Connect
                    </button>
                }
            </div>
        </div>
    )
}
export default Footer;