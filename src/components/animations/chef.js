import React, { useEffect, useState } from 'react';
import ChefCook from './chefCook';
import ChefWalk from './chefWalk';
import ChefWalkWithBurger from './chefWalkWithBurger';

const START_POS_PC = 240;
const START_POS_MOBILE = 113;
const END_POS_PC = 270;
const END_POS_MOBILE = 125;
const DELTA_PC = 50;
const DELTA_MOBILE = 28;

const Chef = ({ chefId, cookingTime, walkTime, backTime }) => {
    const isMobile = window.matchMedia("only screen and (max-width: 800px)").matches;

    const startPos = isMobile ? START_POS_MOBILE : START_POS_PC;
    const endPos = isMobile ? END_POS_MOBILE : END_POS_PC;
    const delta = isMobile ? DELTA_MOBILE : DELTA_PC;

    const totalTime = cookingTime + walkTime + backTime;
    const [step, setStep] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setStep(prev => prev >= totalTime - 100 ? 0 : prev + 100);
        }, 100);
        return () => clearInterval(intervalId);
    }, [totalTime]);

    return (
        <div className='chef'>
            {
                (cookingTime < step && step <= (cookingTime + walkTime)) &&
                (<ChefWalkWithBurger chefId={chefId} startPos={startPos} endPos={endPos} delta={delta} walkTime={walkTime} />)
            }
            {
                ((cookingTime + walkTime) < step && step <= totalTime) &&
                (<ChefWalk chefId={chefId} startPos={startPos} endPos={endPos} delta={delta} backTime={backTime} />)
            }
            {
                (step <= cookingTime) && (<ChefCook chefId={chefId} startPos={startPos} delta={delta} />)
            }
        </div>
    )
}
export default Chef;