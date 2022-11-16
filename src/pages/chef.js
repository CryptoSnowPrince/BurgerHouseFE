import React, { useEffect, useState } from 'react';
import ChefCook from './chefCook';
import ChefWalk from './chefWalk';
import ChefWalkWithPizza from './chefWalkWithPizza';

const Chef = (props) => {
    const totalTime = props.cookingTime + props.workTime + props.backTime;
    const [step, setStep] = useState(0);
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            setStep(prev => prev >= totalTime ? 0 : prev + 1000);
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='chef'>
            {
                (step <= props.cookingTime) && (<ChefCook chefId={props.chefId} />)
            }
            {
                (props.cookingTime < step && step <= (props.cookingTime + props.workTime)) &&
                (<ChefWalkWithPizza chefId={props.chefId} workTime={props.workTime} />)
            }
            {
                ((props.cookingTime + props.workTime) < step && step <= totalTime) &&
                (<ChefWalk chefId={props.chefId} backTime={props.backTime} />)
            }
        </div>
    )
}
export default Chef;