import React, { useEffect, useState } from 'react';

const ChefWalkWithPizza = ({ chefId }) => {
  const LENGTH = chefId == 1 ? 193 : chefId == 2 ? 133 : chefId == 3 ? 73 : 13;

  const [step, setStep] = useState(0);
  const [walk, setWalk] = useState(0);

  useEffect(() => {
    const intervalId1 = setInterval(() => {
      setStep(prev => prev > 18 ? 0 : prev + 1);
      setWalk(prev => prev + 1.7);
    }, 50);

    return () => {
      clearInterval(intervalId1);
    };
  }, []);

  return (
    <div
      className={`chef-walk-with-pizza chef-walk-with-pizza-${step}`}
      style={{ right: `${walk + LENGTH}px` }}>
    </div>
  )
}
export default ChefWalkWithPizza;