import React, { useState } from 'react';

import { getCoinRef, getCashRef } from '../../utils/util';

const Referral = ({
    showReferral,
    refLevel,
    refLink,
    refCoins,
    refCash,
    refs,
    setShowReferral,
}) => {
    const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

    return (
        <div className="popup-wrapper popup-partners referral-window" style={{ display: showReferral ? "block" : "none" }}>
            <div className="popup-box-1">
                <div className="popup-partners-header">Your link</div>
                <div className="popup-partners-input-wrapper">
                    <input className="popup-partners-input" readOnly="readOnly" value={refLink} />
                </div>
                <button type="button"
                    className="popup-partners-btn-copy"
                    onClick={() => {
                        if (navigator.clipboard) {
                            navigator.clipboard.writeText(refLink)
                            setIsTooltipDisplayed(true);
                            setTimeout(() => {
                                setIsTooltipDisplayed(false);
                            }, 3000);
                        }
                    }}
                >
                    Copy
                </button>
                <div className="popup-partners-description">
                    Get <span>{getCoinRef(refLevel)}%</span>
                    <div className="popup-partners-coin-icon" />{` and `}<span>{getCashRef(refLevel)}%</span>
                    <div className="popup-partners-money-icon" />{` from each deposit of your partner.`}
                </div>
                <div className="popup-partners-header" style={{ marginTop: "15px" }}>Referral statistics</div>
                <div className="popup-partners-coins-bar">
                    <div className="popup-partners-coins-bar-icon" />
                    <div className="popup-partners-coins-bar-text">
                        {refCoins}
                    </div>
                </div>
                <div className="popup-partners-money-bar">
                    <div className="popup-partners-money-bar-icon" />
                    <div className="popup-partners-money-bar-text">
                        {refCash}
                    </div>
                </div>
                <div className="popup-partners-users-bar">
                    <div className="popup-partners-users-bar-icon" />
                    <div className="popup-partners-users-bar-text">{refs}</div>
                </div>
            </div>
            <div className="alert" style={{ opacity: isTooltipDisplayed ? 1 : 0 }}>Copied!</div>
            <button type="button" className="popup-btn-close" onClick={() => setShowReferral(false)} />
        </div>
    )
}
export default Referral;