import React, { useEffect, useState } from 'react';

const ChefWalk = ({ chefId = 1 }) => {
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
      clearInterval(intervalId2);
    };
  }, []);

  return (
    <div className={`chef-walk chef-walk-${step}`} style={{ right: `${140 - walk}px`}}></div>
  )
}

export default ChefWalk;