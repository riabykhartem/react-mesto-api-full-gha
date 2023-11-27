import React from "react";
import success from "../../images/Union.svg"
import fail from "../../images/registration-failed.svg"

const LoginInfoTooltip = ({ isOpened, onClose, isLogedIn }) => {
  return (
    <div className={`popup ${isOpened && "popup_opened"}`}>
      <div className="popup__container">
        <button
          type="button"
          className="button popup__close-button"
          onClick={onClose}
        />
        {isLogedIn ? (
          <figure className="info-tooltip__container">
            <img src={success} alt="Галочка" className="info-tooltip__image" />
            <figcaption className="info-tooltip__caption">
              Вы успешно залогились!
            </figcaption>
          </figure>
        ) : (
          <figure className="info-tooltip__container">
            <img src={fail} alt="крестик" className="info-tooltip__image" />
            <figcaption className="info-tooltip__caption">
              Что-то пошло не так! Попробуйте ещё раз.
            </figcaption>
          </figure>
        )}
      </div>
    </div>
  );
};

export default LoginInfoTooltip;
