import React, { useEffect } from "react"
import PopupWithForm from "../popupWithForm/PopupWithForm"
import CurrentUserContext from "../contexts/CurrentUserContext.js";
export default function EditProfilePopup(props) {
  
    const [name, setName] = React.useState('')
    const [description, setDescription] = React.useState('')
    const currentUser = React.useContext(CurrentUserContext)
     
    useEffect(()=>{
        setName(currentUser.name)
        setDescription(currentUser.about)
    }, [currentUser, props.isOpened])
    
    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();
        // Передаём значения управляемых компонентов во внешний обработчик
        props.onUpdateUser({
          name,
          about: description,
        });
      }

    return (
        <PopupWithForm
          name="profile"
          title="Редактировать профиль"
          submitButtonText="Cохранить"
          isOpened={props.isOpened}
          onClose={props.onClose}
          onSubmit={handleSubmit}
        >
          <input
            required
            minLength={2}
            maxLength={40}
            type="text"
            name="name"
            placeholder="Имя"
            id="input-profile-name"
            className="form__input form__input_type_name"
            value={name || ''}
            onChange={(evt)=>{setName(evt.target.value)}}
          />
          <span className="error" id="input-profile-name-error" />
          <input
            required
            minLength={2}
            maxLength={200}
            type="text"
            name="description"
            placeholder="О себе"
            id="input-profile-description"
            className="form__input form__input_type_description"
            value={description || ''}
            onChange={(evt)=>{setDescription(evt.target.value)}}
          />
          <span className="error" id="input-profile-description-error" />
        </PopupWithForm>
    )
}