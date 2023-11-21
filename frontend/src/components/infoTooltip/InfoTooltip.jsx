import React from "react";

const InfoTooltip = ({isOpened, onClose, children}) =>{
    return(
        <div className={`popup ${isOpened && 'popup_opened'}`}>
            <div className="popup__container">
            <button
                type="button"
                className="button popup__close-button"
                onClick={onClose}/>
                {children}
            </div>
            
        </div>
    )
}

export default InfoTooltip