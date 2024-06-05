import React,{useState} from "react";
import style from "./Login.module.scss";
import CheckBox from "../../components/CheckBox";
import { Link } from "react-router-dom";
const Login = () => {
  const [rememberChecked, setRememberChecked] = useState(false);
  return (
    <div className={style["login-container"]}>
      <h2 className={style.title}>Авторизация</h2>
      <form>
        <input className={style.input} placeholder="E-mail" type="email" name="email" required />
        <input className={style.input} placeholder="Пароль" type="password" name="password" required />

        <div className={style["remember-forgot"]}>
          <div>
            {/* <CheckBox isChecked={rememberChecked} onChange={setRememberChecked}/> sss */}
          <input type="checkbox" name="rememberMe" /> Запомнить
          </div>
            <a href="/forgotpassword">Восстановить Пароль</a>
        </div>
        <Link to="/">
        <button type="submit">
          <p>Войти</p>
        </button>
        </Link>
      </form>

      <p>
        Нет аккаунта? <Link to="/registration">Зарегистрируйтесь</Link>
      </p>
    </div>
  );
};

export default Login;
