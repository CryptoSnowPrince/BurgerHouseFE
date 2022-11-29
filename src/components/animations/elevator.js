import React from 'react';

import CounterBoy from "./counterBoy";

const Elevator = ({ openedHouseId }) => {
    return (
        <>
            <div className={`lift lift-${openedHouseId}`} />
            <div className={`lift-bar lift-bar-${openedHouseId}`} />
            <CounterBoy />
            <div className='counter' />
            <div className="logo-desktop" />
        </>
    )
}
export default Elevator;