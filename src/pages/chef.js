import React, { useEffect, useState } from 'react';
import ChefCook from './chefCook';
import ChefWalk from './chefWalk';
import ChefWalkWithPizza from './chefWalkWithPizza';

const Chef = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setStep(prev => prev > 1 ? 0 : prev + 1);
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='chef'>
            {step === 0 && (<ChefCook />)}
            {step === 1 && (<ChefWalkWithPizza />)}
            {step === 2 && (<ChefWalk />)}
        </div>
    )
}
export default Chef;