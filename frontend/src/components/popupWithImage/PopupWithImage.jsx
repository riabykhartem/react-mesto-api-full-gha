export default function PopupWithImage(props) {
  return (
    <div
      className={`popup popup_place_zoom ${props.isOpened && "popup_opened"}`}
    >
      <figure className="zoom">
        <button
          type="button"
          className="button popup__close-button popup__close-button_place_zoom"
          onClick={props.onClose}
        />
        <img
          src={props.card.link}
          alt={props.card.name}
          className="zoom__image"
          onClick={props.onClick}
        />
        <figcaption className="zoom__caption" >{props.card.name}</figcaption>
      </figure>
    </div>
  );
}
