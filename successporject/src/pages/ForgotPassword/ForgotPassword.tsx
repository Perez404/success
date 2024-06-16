import React from "react";
import "./ForgotPassword.scss";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="forgot-password-container">
      <h2>Восстановить пароль</h2>
      <form>
        <input placeholder="E-mail" type="email" name="email" />
        <div className="button-row">
          <Link to="/login">
          <button className="secondary-button" >
        <img
              src="/assets/back.svg"
              alt="Назад"
              width={30}
              height={30}
            />
            <p>Назад</p>
          </button>
            </Link>
          <button className="button">
            <img
              src="/assets/telegram.svg"
              alt="Письмо"
              width={30}
              height={30}
            />
            <p>Отправить письмо</p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
