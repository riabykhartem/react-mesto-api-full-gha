import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Header from "../header/Header";

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(evt){
    evt.preventDefault()
    props.onSubmit({email,password})
  }

  return (
    <>
      <Header>
        <NavLink to="/sign-up" className="link">Регистрация</NavLink>
      </Header>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-form_header">Вход</h1>
        <div className="login-form_input-container">
          <input
            value={email}
            onChange={(evt)=>{
                setEmail(evt.target.value)
            }}
            type="text"
            className="login-form_input"
            placeholder="Email"
          ></input>
          <input
            type="text"
            className="login-form_input"
            placeholder="Пароль"
            value={password}
            onChange={(evt)=>{
                setPassword(evt.target.value)
            }}
          ></input>
          <button type="submit" className="login-form_submit-button">
            войти
          </button>
        </div>
      </form>
    </>
  );
};
export default Login;
