
class Api  {
  constructor(options) {
    this._url = options.url;
  }
  _getResponseData(res) {
    return res.ok ? res.json() : Promise.reject();
  }

  getUserInfo(token) {
    return fetch(`${this._url}/users/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }).then(this._getResponseData)
    .catch((err) =>{
      console.log(err);
    });
  }

  getInitialCards(token) {
    return fetch(`${this._url}/cards`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }).then(this._getResponseData)
    .catch((err) =>{
      console.log(err);
    });
  }

  setUserInfo(data, token) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(this._getResponseData);
  }

  setAvatar(data, token) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this._getResponseData);
  }

  addCard(data, token) {
    return fetch(`${this._url}/cards`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then(this._getResponseData);
  }

  putLike(cardId, token) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(this._getResponseData);
  }

  deleteLike(cardId, token) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }).then(this._getResponseData);
  }

  changeLikeCardStatus(cardId, isLiked, token) {
    if (!isLiked) {
      return this.putLike(cardId, token);
    } else {
      return this.deleteLike(cardId, token);
    }
  }

  deleteCard(cardId, token) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }).then(this._getResponseData);
  }
}

const api = new Api({
  url:  "http://api.mesto.riabykh.nomoredomainsrocks.ru",
});

export default api;
