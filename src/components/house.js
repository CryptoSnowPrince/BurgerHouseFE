import React, { useEffect, useState } from 'react';
import Chef from './animations/chef';

const House = ({ id, houseInfo, isConnected, price, setUpgradeLevel, enableValue }) => {
    // console.log('[PRINCE](value)(id)', id)

    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);

    useEffect(() => {
        const intervalId1 = setInterval(() => {
            setVisible1(true);
        }, Math.floor(Math.random() * 2500));

        const intervalId2 = setInterval(() => {
            setVisible2(true);
        }, Math.floor(Math.random() * 2500) + 2600);

        const intervalId3 = setInterval(() => {
            setVisible3(true);
        }, Math.floor(Math.random() * 2500) + 5200);

        return () => {
            clearInterval(intervalId1);
            clearInterval(intervalId2);
            clearInterval(intervalId3);
        };
    }, []);

    return (
        <div className='floor_house' id={`house${id}`}>
            <div className='counter-boy-in-house' />
            {visible1 && (id > 6) && <Chef className="chef-1" chefId={1} cookingTime={2000} walkTime={2500} backTime={2000} />}
            {visible1 && (id > 4) && <Chef className="chef-2" chefId={2} cookingTime={2000} walkTime={3500} backTime={3000} />}
            {visible2 && (id > 2) && <Chef className="chef-3" chefId={3} cookingTime={2000} walkTime={4500} backTime={4000} />}
            {visible3 && <Chef className="chef-4" chefId={4} cookingTime={2000} walkTime={5500} backTime={5000} />}
            <div className='counter-in-house' />
            <div className='tables'>
                {(id > 6) && <div className='counter-table table1'></div>}
                {(id > 4) && <div className='counter-table table2'></div>}
                {(id > 2) && <div className='counter-table table3'></div>}
                <div className='counter-table table4'></div>
            </div>
            <button className="btn-red btn-floor"
                disabled={!isConnected}
                onClick={() => setUpgradeLevel(id)}>
                {enableValue() && parseInt(houseInfo.levels[id - 1]) === 5 ? (
                    <div className="level-text" style={{ color: "yellow" }}>Top Level</div>
                ) : (
                    <>
                        <div className="farm-coin" >&nbsp;</div>
                        <div className="level-text">
                            {enableValue() ? price[parseInt(houseInfo.levels[id - 1])][id - 1] : price[0][id - 1]}
                        </div>
                    </>
                )}
            </button>
        </div>
    )
}
export default House;