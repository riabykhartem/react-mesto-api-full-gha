import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Header from "../header/Header";

const Register = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  function handleSubmit(evt){
    evt.preventDefault()
    props.onSubmit({email: email, password: password})
  }

  
  return (
    <>
      <Header>
        <NavLink to="/sign-in" className="link">Войти</NavLink>
      </Header>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-form_header">Регистрация</h1>
        <div className="login-form_input-container">
          <input
            value={email}
            onChange={(evt) => {
              setEmail(evt.target.value);
            }}
            type="text"
            className="form__input login-form_input"
            placeholder="Email"
          ></input>
          <input
            value={password}
            onChange={(evt) => {
                setPassword(evt.target.value)}
            }
            type="password"
            className="login-form_input"
            placeholder="Пароль"
          ></input>
          <button type="submit" className="login-form_submit-button">
            Зарегистрироваться
          </button>
          <NavLink to="/sign-in" className="link">Уже зарегистрированы? Войти</NavLink>
        </div>
      </form>
    </>
  );
};
export default Register;
