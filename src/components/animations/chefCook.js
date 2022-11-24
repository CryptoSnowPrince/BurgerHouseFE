import React from 'react';

const START_POS_PC = 240;
const START_POS_MOBILE = 136;
const DELTA_PC = 50;
const DELTA_MOBILE = 34;

const ChefCook = ({ chefId }) => {
  const isMobile = window.matchMedia("only screen and (max-width: 800px)").matches;

  const startPos = isMobile ? START_POS_MOBILE : START_POS_PC;
  const delta = isMobile ? DELTA_MOBILE : DELTA_PC;

  return (
    <div
      className="chef-cooking"
      style={{ right: `${startPos - chefId * delta}px` }}
    />
  )
}
export default ChefCook;