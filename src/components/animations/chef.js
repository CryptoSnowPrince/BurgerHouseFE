import React, { useEffect, useState } from 'react';
import ChefCook from './chefCook';
import ChefWalk from './chefWalk';
import ChefWalkWithPizza from './chefWalkWithPizza';

const Chef = ({ chefId, cookingTime, workTime, backTime }) => {
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
            <ChefCook chefId={chefId} />
            {/* {
                (step <= cookingTime) && (<ChefCook chefId={chefId} />)
            } */}
            {/* {
                (cookingTime < step && step <= (cookingTime + workTime)) &&
                (<ChefWalkWithPizza chefId={chefId} />)
            }
            {
                ((cookingTime + workTime) < step && step <= totalTime) &&
                (<ChefWalk chefId={chefId} />)
            } */}
        </div>
    )
}
export default Chef;