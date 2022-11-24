import React from 'react';

const ChefCook = ({ chefId, startPos, delta }) => {
  return (
    <div
      className="chef-cooking"
      style={{ right: `${startPos - chefId * delta}px` }}
    />
  )
}
export default ChefCook;