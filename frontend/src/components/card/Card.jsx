import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
export default function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = props.card.owner._id === currentUser._id;
  const isLiked = props.card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = ( 
    `element__like-button ${isLiked && 'element__like-button_active'}` 
  );; 

  return (
    <li className="element">
      <img
        src={props.link}
        alt={props.name}
        className="element__photo"
        onClick={() => props.onCardClick({link: props.link, name: props.name})}
      />
      {isOwn && <button className="button element__trash-button" onClick={()=> props.onDelete(props.card._id)}/>}
      <div className="element__footer">
        <h2 className="element__name">{props.name}</h2>
        <div className="element__likes-container">
          <button
            type="button"
            aria-label="like"
            className={`button ${cardLikeButtonClassName}`}
            onClick={() => props.onLike(props.card)}
          />
          <span className="element__likes-counter">{props.likes.length}</span>
        </div>
      </div>
    </li>
  );
}
