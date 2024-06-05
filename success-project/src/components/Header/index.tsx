import React from "react";
import style from "./Header.module.scss";
import { Link } from "react-router-dom";

const index = () => {
  return (
    <header className={style.header}>
      <div className={style.block}>
        <img
          src="/assets/successLogo.svg"
          alt="Логотип"
          width={30}
          height={30}
          className={style.logo}
        />
        <h3 className={style.title}>Мой успех</h3>
      </div>
      <div className={style.block}>
      <button className={style.button}>
          <img
            src="/assets/notification.svg"
            alt="Выход лого"
            width={40}
            height={40}
            className={style.logo}
          />
        </button>
        <Link to="/login">
        <button className={style.button}>
          <img
            src="/assets/profileLogo.svg"
            alt="Профиль лого"
            width={30}
            height={30}
            className={style.logo}
          />
        </button>
        </Link>
        <button className={style.button}>
          <img
            src="/assets/exitLogo.svg"
            alt="Выход лого"
            width={30}
            height={30}
            className={style.logo}
          />
        </button>
      </div>
    </header>
  );
};

export default index;
