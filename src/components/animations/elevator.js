import React from 'react';

import CounterBoy from "./counterBoy";

const Elevator = () => {
    return (
        <>
            <div className="lift" />
            <div className='lift-bar' />
            <CounterBoy />
            <div className='counter' />
            <div className="logo-desktop" />
        </>
    )
}
export default Elevator;