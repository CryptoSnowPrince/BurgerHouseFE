import React, { useEffect, useState } from 'react';

const ChefWalkWithBurger = ({ chefId, startPos, delta }) => {
  const [walk, setWalk] = useState(0);

  useEffect(() => {
    const intervalId1 = setInterval(() => {
      setWalk(prev => prev + 1.7);
    }, 50);

    return () => {
      clearInterval(intervalId1);
    };
  }, []);

  return (
    <div
      className="chef-walk-with-burger"
      style={{ right: `${startPos - chefId * delta}px` }}
    // style={{ right: `${walk + LENGTH}px` }}
    />
  )
}
export default ChefWalkWithBurger;