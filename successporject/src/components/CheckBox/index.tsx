import React from 'react';
import style from "./CheckBox.module.scss";

interface CheckBoxProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({ isChecked, onChange }) => {
  return (
    <label className={style["checkbox-wrapper"]}>
      <input
        type="checkbox"
        className={style["checkbox-element"]}
        checked={isChecked}
        onChange={() => onChange(!isChecked)}
      />
    </label>
  );
}

export default CheckBox;

