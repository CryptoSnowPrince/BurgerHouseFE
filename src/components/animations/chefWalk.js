import React, { useEffect, useState } from 'react';

const ChefWalk = ({ chefId, startPos, endPos, delta, backTime }) => {
  const start = startPos - chefId * delta;
  const distance = endPos - start;
  const step = distance * 50 / backTime;

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
      className="chef-walk"
      style={{ right: `${endPos - walk}px` }}
    />
  )
}

export default ChefWalk;