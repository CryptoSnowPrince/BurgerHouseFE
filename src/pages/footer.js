import React from 'react';

import ParkingManager from "./parkingManager";
import DeliveryMan from "./deliveryMan";

const Footer = (props) => {
    return (
        <div className='footer'>
            <div class="floor-0-background">
                <div class="floor-0-parking-pos">
                    <ParkingManager />
                    <div class="floor-0-brick-wall"></div>
                    <div class="floor-0-roof"></div>
                    {/* <DeliveryMan nSpeed={4} /> */}
                </div>
            </div>
            <div className="bg-ground-my-bottom"></div>
            <div className="get-money">
                {props.isConnected ?
                    <button type="button" className="btn-green"
                        style={{ fontWeight: "bold" }}
                        onClick={() => props.setShowGetMoney(true)}>
                        Get Money
                    </button> :
                    <button type="button" className="btn-green btn-login" style={{ fontWeight: "bold" }}
                        onClick={props.loadWeb3Modal}>
                        Connect
                    </button>
                }
            </div>
        </div>
    )
}
export default Footer;