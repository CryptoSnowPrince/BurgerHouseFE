import React, { useEffect, useState } from 'react';
const ChefWalkWithPizza = ({ chefId, distance }) => {
  const [step, setStep] = useState(0);
  const [walk, setWalk] = useState(0);
  const [LENGTH, setLength] = useState(chefId == 1 ? 193 : chefId == 2 ? 133 : chefId == 3 ? 73 : 13);
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
      style={{ right: `${walk + LENGTH}px` }}>
    </div>
  )
}
export default ChefWalkWithPizza;