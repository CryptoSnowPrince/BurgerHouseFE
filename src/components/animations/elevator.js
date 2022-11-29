import React from 'react';

import CounterBoy from "./counterBoy";

const Elevator = ({ openedHouseId }) => {
    console.log('[PRINCE](openedHouseId):', openedHouseId)
    return (
        <>
            {/* <div className={`lift lift-${openedHouseId}`} /> */}
            <div className={`lift lift-${8}`} />
            {/* <div className={`lift-bar lift-bar-${openedHouseId}`} /> */}
            <CounterBoy />
            <div className='counter' />
            <div className="logo-desktop" />
        </>
    )
}
export default Elevator;