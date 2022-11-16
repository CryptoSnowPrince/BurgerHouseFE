import React, { useEffect, useState } from 'react';

const ChefWalk = ({ chefId = 1 }) => {
  const LENTGH = chefId == 1 ? 300 : chefId == 2 ? 350 : chefId == 3 ? 360 : 370;

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
      className={`chef-walk chef-walk-${step}`}
      style={{ right: `${LENTGH - walk}px` }}
    >
    </div>
  )
}

export default ChefWalk;