export default function PopupWithForm(props) {
  return (
    <div className={`popup popup_place_${props.name} ${props.isOpened && 'popup_opened'}`}>
      <div className="popup__container">
        <button
          type="button"
          className="button popup__close-button"
          onClick={props.onClose}
        />
        <form
        className="form form_place_profile"
        name={props.name}
        method="post"
        noValidate
        onSubmit={props.onSubmit}
        >
          <h2 className="form__title">{props.title}</h2>
          {props.children}
          <button
            type="submit"
            className="form__save-button" 
            >
              {props.submitButtonText}
          </button>
        </form>
      </div>
    </div>
  );
}
