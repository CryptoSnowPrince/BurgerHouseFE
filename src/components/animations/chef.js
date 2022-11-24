import React, { useEffect, useState } from 'react';
import ChefCook from './chefCook';
import ChefWalk from './chefWalk';
import ChefWalkWithBurger from './chefWalkWithBurger';

const START_POS_PC = 240;
const START_POS_MOBILE = 136;
const DELTA_PC = 50;
const DELTA_MOBILE = 34;

const Chef = ({ chefId, cookingTime, workTime, backTime }) => {
    const isMobile = window.matchMedia("only screen and (max-width: 800px)").matches;

    const startPos = isMobile ? START_POS_MOBILE : START_POS_PC;
    const delta = isMobile ? DELTA_MOBILE : DELTA_PC;

    const totalTime = cookingTime + workTime + backTime;
    const [step, setStep] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setStep(prev => prev >= totalTime ? 0 : prev + 1000);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [totalTime]);

    return (
        <div className='chef'>
            <ChefWalkWithBurger chefId={chefId} startPos={startPos} delta={delta} />
            (<ChefWalk chefId={chefId} startPos={startPos} delta={delta} />)
            <ChefCook chefId={chefId} startPos={startPos} delta={delta} />
            {/* {
                (step <= cookingTime) && (<ChefCook chefId={chefId} startPos={startPos} delta={delta} />)
            } */}
            {/* {
                (cookingTime < step && step <= (cookingTime + workTime)) &&
                (<ChefWalkWithBurger chefId={chefId} startPos={startPos} delta={delta} />)
            } */}
            {/* {
                ((cookingTime + workTime) < step && step <= totalTime) &&
                (<ChefWalk chefId={chefId} startPos={startPos} delta={delta} />)
            } */}
        </div>
    )
}
export default Chef;