class Auth{
    constructor(props){
        this._baseUrl = props.baseUrl;
    }

    _getResponseData(res){
        return res.ok ? res.json() : Promise.reject();
    };

    register(data){
        fetch(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: data.password,
                email: data.email
            })
        }).then(this._getResponseData)
    }

    login(data, token){
        fetch(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body: JSON.stringify({
                password: data.password,
                email: data.email
            })
        }).then(this._getResponseData)
    }

    getContent(token){
        fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            }
        })
        .then(this._getResponseData)
    }
}
const auth = new Auth({
    url: "https://api.mesto.riabykh.nomoredomainsrocks.ru",
  });

export default auth
