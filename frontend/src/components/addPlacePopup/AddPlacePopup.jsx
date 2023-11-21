import React from "react";
import PopupWithForm from "../popupWithForm/PopupWithForm";

export default function AddPlacePopup(props) {
  const [name, setName] = React.useState("");
  const [url, setUrl] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();
    props.onAddPlace({
      name: name,
      link: url,
    });
  }

  return (
    <PopupWithForm
      isOpened={props.isOpened}
      name="add-card"
      title="Новое место"
      submitButtonText="Создать"
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        required
        name="name"
        minLength="2"
        maxLength="30"
        type="text"
        placeholder="Название"
        id="input-card-name"
        className="form__input form__input_type_avatar"
        value={name || ""}
        onChange={(evt) => {
          setName(evt.target.value);
        }}
      />
      <span className="error" id="input-card-name-error"></span>
      <input
        required
        name="link"
        type="url"
        placeholder="Ссылка на картинку"
        id="input-card-url"
        className="form__input form__input_type_url"
        value={url || ""}
        onChange={(evt) => {
          setUrl(evt.target.value);
        }}
      />
      <span className="error" id="input-card-url-error"></span>
    </PopupWithForm>
  );
}
