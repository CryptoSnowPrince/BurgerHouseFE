import React from 'react';

const RightPanel = ({ allHousesLength, totalInvested, totalUpgrades, partners }) => {
    return (
        <div className="menu-fixed-right">
            <div className="panels">
                <div className="panel">
                    <div className="panel-left">Total Houses</div>
                    <div className="panel-right panel-towers-value">{allHousesLength}</div>
                </div>
                <div className="panel">
                    <div className="panel-left">Total Deposits</div>
                    <div className="panel-right panel-towers-value">{`${totalInvested} BNB`}</div>
                </div>
                <div className="panel">
                    <div className="panel-left">Total Upgrades</div>
                    <div className="panel-right panel-towers-value">{totalUpgrades}</div>
                </div>
                <div className="panel">
                    <div className="panel-left">Your Partners</div>
                    <div className="panel-right panel-towers-value">{partners}</div>
                </div>
            </div>
        </div>
    )
}
export default RightPanel;