import React from 'react';

const ChefCook = ({ chefId }) => {
  return (
    <div
      // className={`chef-${chefId}-cooking chef-cooking`}
      className="chef-cooking"
      style={{ right: `${270 - chefId * 50}px` }}
    />
  )
}
export default ChefCook;