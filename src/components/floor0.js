import React from 'react';

import DeliveryMan from "./animations/deliveryMan";

const Floor0 = ({ showDeliveryMan }) => {
    return (
        <div className="floor-0">
            {
                showDeliveryMan && <DeliveryMan />
            }
        </div>
    )
}
export default Floor0;