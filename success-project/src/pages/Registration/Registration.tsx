import React from "react";
import "./Registration.scss"
import { Link } from "react-router-dom";

const Registration = () => {
  return (
    <div className="registration-container">
      <h2>Регистрация</h2>
      <form>
        <input
          placeholder="Имя пользователя"
          type="text"
          name="username"
          required
        />
        <input
          placeholder="E-mail"
          type="email"
          name="email"
          required
        />
        <input
          placeholder="Пароль"
          type="password"
          name="password"
          required
        />
                <input
          placeholder="Подтвердить пароль"
          type="password"
          name="password"
          required
        />
        <div className="button-row">
        <Link to="/login">
        <button className="secondary-button">
            <img
              src="/assets/back.svg"
              alt="Назад"
              width={30}
              height={30}
            />
            <p>Назад</p>
          </button>
        </Link>
          <button>
            <p>Зарегистрироваться</p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
