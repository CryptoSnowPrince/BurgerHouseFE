import React, { useEffect, useState } from 'react';

const DISTANCE = 100;

const ChefWalkWithPizza = ({ chefId, endPosition }) => {
  const [step, setStep] = useState(0);
  const [walk, setWalk] = useState(0);

  useEffect(() => {
    const intervalId1 = setInterval(() => {
      setStep(prev => prev > 18 ? 0 : prev + 1);
    }, 50);

    const intervalId2 = setInterval(() => {
      setWalk(prev => prev + 1.7);
    }, 50);
    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2)
    };
  }, []);

  return (
    <div
      className={`chef-walk-with-pizza chef-walk-with-pizza-${step}`}
      style={{ right: `${walk + chefId * DISTANCE + endPosition}px` }}></div>
  )
}

export default ChefWalkWithPizza;