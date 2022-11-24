import React, { useEffect, useState } from 'react';

const ChefWalkWithBurger = ({ chefId, startPos, endPos, delta, walkTime }) => {
  const start = startPos - chefId * delta;
  const distance = endPos - start;
  const step = distance * 50 / walkTime;

  const [walk, setWalk] = useState(0);

  useEffect(() => {
    const intervalId1 = setInterval(() => {
      setWalk(prev => prev > distance ? distance : prev + step);
    }, 50);

    return () => {
      clearInterval(intervalId1);
    };
  }, [distance, step]);

  return (
    <div
      className="chef-walk-with-burger"
      style={{ right: `${start + walk}px` }}
    />
  )
}
export default ChefWalkWithBurger;