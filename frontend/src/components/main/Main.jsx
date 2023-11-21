import { NavLink } from "react-router-dom";
import Card from "../card/Card.jsx";
import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import Header from "../header/Header.jsx";


export default function Main(props) {
  const initialCards = props.initialCards;

  const currentUser = React.useContext(CurrentUserContext);
  
  
  return (
    <>
    <Header>
      <div className="header__container">
        <p className="header__email">{props.email}</p>
        <NavLink to="/sign-in" className="link link_place_log-out" onClick={props.onLogOut}>выйти</NavLink>
      </div>
    </Header>
    <main>
      <section className="profile section">
        <div className="profile__container">
          <button
            type="button"
            className="profile__avatar-button"
            onClick={props.onEditAvatar}
          >
            <img
              src={currentUser.avatar}
              alt="аватар"
              className="profile__avatar"
            />
          </button>
          <div className="profile__info">
            <h1 className="profile__name">{currentUser.name}</h1>
            <p className="profile__description">{currentUser.about}</p>
            {/* редактировать профиль */}
            <button
              type="button"
              aria-label="edit"
              className="button profile__edit-button"
              onClick={props.onEditProfile}
            />
          </div>
        </div>
        <button
          type="button"
          aria-label="add"
          className="button profile__add-button"
          onClick={props.onAddPlaceClick}
        />
      </section>
      <section className="elements section">
        <template className="template" />
        <ul className="elements__list">
          {initialCards.map((data) => {
            return (
              <Card
                card={data}
                name={data.name}
                link={data.link}
                key={data._id}
                onCardClick={props.onCardClick}
                likes={data.likes}
                onLike={props.onLike}
                onDelete={props.onDelete}
              />
            );
          })}
        </ul>
      </section>
    </main>
    </>
  );
}
