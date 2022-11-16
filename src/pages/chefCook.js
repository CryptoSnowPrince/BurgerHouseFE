import React, { useEffect, useState } from 'react';

const Chef = ({ chefId }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setStep(prev => prev > 28 ? 0 : prev + 1);
    }, 50);
    return () => clearInterval(intervalId);
  }, []);


  return (
    <div className={`chef-${chefId}-cooking chef-cooking chef-cooking-${step}`}></div>
  )
}

export default Chef;