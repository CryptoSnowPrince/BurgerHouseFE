import React, { useEffect, useState } from 'react';
import Chef from './chef';

const House = ({ id = 0, houseInfo, price, tableCount = 3, setUpgradeLevel, enableValue }) => {
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);

    useEffect(() => {
        const intervalId1 = setInterval(() => {
            setVisible1(true);
        }, Math.floor(Math.random() * 3000));
    
        const intervalId2 = setInterval(() => {
            setVisible2(true);
        }, Math.floor(Math.random() * 10000) + 4000);

        const intervalId3 = setInterval(() => {
            setVisible3(true);
        }, Math.floor(Math.random() * 7000) + 2000);
    
        return () => {
          clearInterval(intervalId1);
          clearInterval(intervalId2);
          clearInterval(intervalId3);
        };
      }, []);
    
    return (
        <div className='floor_kitchen'>
            <div className="barn" id={`home${id}`}>
                <div className={`home home-${id}`} />
                <div className={`kitchen kitchen-${id}`}>
                    <div className='tables'>
                        <div className='table table1'></div>
                        <div className='table table2'></div>
                        <div className='table table3'></div>
                    </div>
                    {visible1 && <Chef className="chef-box" />}
                    {visible2 && <Chef className="chef-box1" />}
                    {visible3 && <Chef className="chef-box2" />}
                </div>
            </div>

            <div className="barn-action">
                <button className="btn-red btn-buy-barn"
                    onClick={() => setUpgradeLevel(id + 1)}>
                    {enableValue() && parseInt(houseInfo.levels[id]) === 5 ? (
                        <div className="level-text" style={{ color: "yellow" }}>Top Level</div>
                    ) : (
                        <>
                            <div className="farm-coin" >&nbsp;</div>
                            <div className="level-text">
                                {enableValue() ? price[parseInt(houseInfo.levels[id + 1])][id] : price[0][id - 1]}
                            </div>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default House;