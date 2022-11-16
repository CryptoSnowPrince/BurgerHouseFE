import React, { useEffect, useState } from 'react';

const ChefCook = ({ chefId }) => {
  const [step, setStep] = useState(0);
  const LENGTH = chefId === 1 ? 193 : chefId === 2 ? 133 : chefId === 3 ? 73 : 13;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setStep(prev => prev > 28 ? 0 : prev + 1);
    }, 50);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`chef-${chefId}-cooking chef-cooking chef-cooking-${step}`}
      style={{ right: `${LENGTH}px` }}
    />
  )
}
export default ChefCook;