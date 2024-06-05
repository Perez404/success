import React from 'react'
import style from "./Icon.module.scss"

const index = () => {
  return (
    <div>
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
  )
}

export default index
