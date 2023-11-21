import React from "react";
import PopupWithForm from "../popupWithForm/PopupWithForm";
export default function EditAvatarPopup(props) {
    const avatarRef = React.useRef('')
    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateAvatar({avatar: avatarRef.current.value})
        props.onClose()
      } 
    
    return(

        <PopupWithForm
          name="avatar"
          title="Обновить аватар"
          submitButtonText="Cохранить"
          isOpened={props.isOpened}
          onClose={props.onClose}
          onSubmit={handleSubmit}
        >
          <input
          ref={avatarRef}
            required
            name="avatar"
            type="url"
            placeholder="Ссылка на картинку"
            id="input-avatar"
            className="form__input form__input_type_url"
          />
          <span className="error" id="input-avatar-error"></span>
        </PopupWithForm>
    )

}