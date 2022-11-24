import React, { useEffect, useState } from 'react';

const ChefWalk = ({ chefId, startPos, delta }) => {
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
      className="chef-walk"
      style={{ right: `${startPos - chefId * delta}px` }}
    // style={{ right: `${LENTGH - walk}px` }}
    >
    </div>
  )
}

export default ChefWalk;