import React, { useEffect, useState } from 'react';
import ChefCook from './chefCook';
import ChefWalk from './chefWalk';
import ChefWalkWithPizza from './chefWalkWithPizza';

const Chef = (chefId, cookingTime, workTime, endPosition, backTime) => {
    const totalTime = cookingTime + workTime + backTime;
    const [step, setStep] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setStep(prev => prev > totalTime ? 0 : prev + 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='chef'>
            {step <= cookingTime && (<ChefCook chefId={chefId} />)}
            {
                (cookingTime < step && step <= (cookingTime + workTime)) &&
                (<ChefWalkWithPizza chefId={chefId} endPosition={endPosition} />)
            }
            {
                ((cookingTime + workTime) < step && step <= totalTime) &&
                (<ChefWalk chefId={chefId} endPosition={endPosition} />)
            }
        </div>
    )
}
export default Chef;