import "../index.css";
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate} from "react-router-dom";
import Main from "./main/Main.jsx";
import Footer from "./footer/Footer.jsx";
import PopupWithForm from "./popupWithForm/PopupWithForm.jsx";
import PopupWithImage from "./popupWithImage/PopupWithImage.jsx";
import api from "../utils/api.js";
import CurrentUserContext from "./contexts/CurrentUserContext.js";
import EditProfilePopup from "./editProfilePopup/EditProfilePopup";
import EditAvatarPopup from "./editAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "./addPlacePopup/AddPlacePopup";
import ProtectedRouteElement from "./protetedRoute/ProtectedRoute";
import Register from "./Register/Register";
import Login from "./login/Login"
import InfoTooltip from "./infoTooltip/InfoTooltip";
import auth from '../utils/auth'
import success from "../images/Union.svg"
import fail from "../images/registration-failed.svg"

function App() {
  //стейты
  const [loggedIn, setloggedIn] = useState(true);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [zoomedCard, setZoomedCard] = useState({});
  const [isZoomPopupOpen, setZoomedCardOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [initialCards, setInitialCards] = useState([]);
  const [isSignedup, setIsSignedup] =useState(false);
  const [isInfoTooltipPopupOpened, setisInfoTooltipPopupOpened] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState(null)
  
  useEffect(()=>{
    tokenCheck()
    Promise.all([api.getUserInfo(token), api.getInitialCards(token)])
    .then(([userData, cardsData])=>{
      setCurrentUser({name: userData.name, about: userData.about, avatar: userData.avatar, _id:userData._id})
      setInitialCards(cardsData)
    }).catch((err)=>{
      console.log('проблема с получением информации о пользователе и карточек');
    })
  },[token])

  function tokenCheck(){
    if(!token){
      return
    }
    auth.getContent(token)
    .then(res =>{
      setEmail(res.email)
    setloggedIn(true)})
    .catch((err) => {
      console.error(`ошибка при получении данных пользователя: ${err}`)}
      )
  }

  const navigate = useNavigate()


  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }
  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }
  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }
  function handleCardClick(card) {
    setZoomedCard(card);
    setZoomedCardOpen(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    
    api
      .changeLikeCardStatus(card._id, isLiked, token)
      .then((newCard) => {
        setInitialCards((initialCards) =>
          initialCards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => `ошибка при нажатии лайка: ${err}`);
  }

  function handleCardDelete(deletedCardId) {
    api
      .deleteCard(deletedCardId, token)
      .then(
        setInitialCards(
          initialCards.filter((card) => {
            if (card._id === deletedCardId) {
              return null;
            } else {
              return card;
            }
          })
        )
      )
      .catch((err) => console.error(`ошибка при удалении карточки: ${err}`));
  }
  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditProfilePopupOpen(false);
    setZoomedCardOpen(false);
    setisInfoTooltipPopupOpened(false)
  }

  function handleUpdateUser(newUserData) {
    api
      .setUserInfo({ name: newUserData.name, about: newUserData.about }, token)
      .then((res) =>
        setCurrentUser({
          name: res.name,
          about: res.about,
          avatar: currentUser.avatar,
        })
      )
      .then(() => closeAllPopups())
      .catch((err) =>
        console.error(`ошибка при редактировании профиля: ${err}`)
      );
  }

  function handleUpdateAvatar(newAvatar) {
    api
      .setAvatar(newAvatar, token)
      .then((res) => setCurrentUser({ ...currentUser, avatar: res.avatar }))
      .catch((err) => console.error(`ошибка при обновлении автара: ${err}`));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard, token)
      .then((dataCard) => setInitialCards([dataCard, ...initialCards]))
      .then(closeAllPopups())
      .catch((err) => `ошибка при добавлении новой карточки: ${err}`);
  }

  function handleSingUp(credentials){
    auth.register(credentials)
    .then(()=>{
      setIsSignedup(true)
      navigate('/sign-in')
    }
    )
    .catch((err) => console.error(`ошибка при регистрации: ${err}`))
    .finally(
      setisInfoTooltipPopupOpened(true)
    )
  }


  function handleSingIn(credentials){
    auth.login(credentials).then((res) =>{
      setToken(res.token)
      localStorage.setItem('token', res.token)
      navigate('/',{replace:true})
    }).catch(()=>setisInfoTooltipPopupOpened(true))
  }

  function logOut(){
    setloggedIn(false)
    localStorage.removeItem('token')
    
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__container">
        
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRouteElement
                element={
                  <Main
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlaceClick={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    initialCards={initialCards}
                    onLike={handleCardLike}
                    onDelete={handleCardDelete}
                    email={email}
                    onLogOut={logOut}
                  />
                }
                loggedIn={loggedIn}
              />
            }
          />
          <Route path="/sign-up" element={<Register onSubmit={handleSingUp} onClose={closeAllPopups}/>}/>
          <Route path="/sign-in" element={<Login onSubmit={handleSingIn}/>}/>
        </Routes>
        <Footer />

        <EditProfilePopup
          isOpened={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        ></EditProfilePopup>

        <EditAvatarPopup
          isOpened={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        ></EditAvatarPopup>

        <AddPlacePopup
          isOpened={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          onAddPlace={handleAddPlaceSubmit}
        ></AddPlacePopup>

        <PopupWithForm
          name="delete-card"
          title="Редактировать профиль"
          submitButtonValue="Да"
        />

        <PopupWithImage
          card={zoomedCard}
          isOpened={isZoomPopupOpen}
          onCardClick={handleCardClick}
          onClose={closeAllPopups}
        />
        <InfoTooltip isOpened={isInfoTooltipPopupOpened} onClose={closeAllPopups}>
               {isSignedup || loggedIn ? 
                    <figure className="info-tooltip__container">
                        <img src={success} alt="Галочка" className="info-tooltip__image"/>
                        <figcaption className="info-tooltip__caption">Вы успешно зарегистрировались!</figcaption>
                    </figure>
            :
                <figure className="info-tooltip__container">
                    <img src={fail} alt="крестик" className="info-tooltip__image"/>
                    <figcaption className="info-tooltip__caption">Что-то пошло не так! Попробуйте ещё раз.</figcaption>
                </figure>} 

        </InfoTooltip>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
