import React, { useEffect, useState } from 'react';
import Chef from './animations/chef';

const House = ({ id = 0, houseInfo, isConnected, price, tableCount = 3, setUpgradeLevel, enableValue }) => {
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
                        {(id > 6) && <div className='table table1'></div>}
                        {(id > 4) && <div className='table table2'></div>}
                        {(id > 2) && <div className='table table3'></div>}
                        <div className='table table4'></div>
                    </div>
                    {visible1 && (id > 6) && <Chef className="chef-1" chefId={1} cookingTime={1000} workTime={3000} backTime={3000} />}
                    {visible1 && (id > 4) && <Chef className="chef-2" chefId={2} cookingTime={1000} workTime={5000} backTime={6000} />}
                    {visible2 && (id > 2) && <Chef className="chef-3" chefId={3} cookingTime={1000} workTime={7000} backTime={8000} />}
                    {visible3 && <Chef className="chef-4" chefId={4} cookingTime={2000} workTime={9000} backTime={10000} />}
                </div>
            </div>

            <div className="barn-action">
                <button className="btn-red btn-buy-barn"
                    disabled={!isConnected}
                    onClick={() => setUpgradeLevel(id + 1)}>
                    {enableValue() && parseInt(houseInfo.levels[id]) === 5 ? (
                        <div className="level-text" style={{ color: "yellow" }}>Top Level</div>
                    ) : (
                        <>
                            <div className="farm-coin" >&nbsp;</div>
                            <div className="level-text">
                                {/* {enableValue() ? price[parseInt(houseInfo.levels[id + 1])][id] : price[0][id - 1]} */}
                            </div>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
export default House;