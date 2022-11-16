import React, { useEffect, useState } from 'react';
const ChefWalk = ({ chefId = 1, workTime }) => {
  const [step, setStep] = useState(0);
  const [walk, setWalk] = useState(0);
  const [LENTGH, setLength] = useState(chefId == 1 ? 300 : chefId == 2 ? 350 : chefId == 3 ? 360 :370);

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
    <div
      className={`chef-walk chef-walk-${step}`}
      style={{right: `${LENTGH - walk}px` }}
    >
    </div>
  )
}

export default ChefWalk;