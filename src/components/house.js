import React, { useEffect, useState } from 'react';
import Chef from './animations/chef';

const House = ({ id, houseLevel, isConnected, price, setUpgradeLevel }) => {
    // console.log('[PRINCE](value)(id)', id)

    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [visible4, setVisible4] = useState(false);

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

        const intervalId4 = setInterval(() => {
            setVisible4(true);
        }, Math.floor(Math.random() * 2500) + 7800);

        return () => {
            clearInterval(intervalId1);
            clearInterval(intervalId2);
            clearInterval(intervalId3);
            clearInterval(intervalId4);
        };
    }, []);

    return (
        <div className='floor_house' id={`house${id}`}>
            <div className='counter-boy-in-house' />
            {(houseLevel > 0 || !isConnected) && <Chef className="chef-5" chefId={4} cookingTime={2000} walkTime={5500} backTime={5000} />}
            {visible4 && (houseLevel > 1 || (!isConnected && id > 2)) && <Chef className="chef-4" chefId={3} cookingTime={2000} walkTime={4500} backTime={4000} />}
            {visible3 && (houseLevel > 2 || (!isConnected && id > 4)) && <Chef className="chef-3" chefId={2} cookingTime={2000} walkTime={3500} backTime={3000} />}
            {visible2 && (houseLevel > 3 || (!isConnected && id > 6)) && <Chef className="chef-2" chefId={1} cookingTime={2000} walkTime={2500} backTime={2000} />}
            {visible1 && (houseLevel > 4 || (!isConnected && id > 7)) && <Chef className="chef-1" chefId={0} cookingTime={2000} walkTime={1500} backTime={1000} />}
            <div className='counter-in-house' />
            <div className='tables'>
                {(houseLevel > 0 || !isConnected) && <div className='counter-table table5' />}
                {(houseLevel > 1 || (!isConnected && id > 2)) && <div className='counter-table table4' />}
                {(houseLevel > 2 || (!isConnected && id > 4)) && <div className='counter-table table3' />}
                {(houseLevel > 3 || (!isConnected && id > 6)) && <div className='counter-table table2' />}
                {(houseLevel > 4 || (!isConnected && id > 7)) && <div className='counter-table table1' />}
            </div>
            <button className="btn-red btn-floor"
                disabled={!isConnected}
                onClick={() => setUpgradeLevel(id)}>
                {houseLevel === 5 ? (
                    <div className="level-text" style={{ color: "yellow" }}>Top Level</div>
                ) : (
                    <>
                        <div className="farm-coin" >&nbsp;</div>
                        <div className="level-text">
                            {price[houseLevel][id - 1]}
                        </div>
                    </>
                )}
            </button>
        </div>
    )
}
export default House;