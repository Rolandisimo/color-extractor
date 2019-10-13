import React from "react";
import styles from "./Input.module.scss";

export const Input = ({
  type = "text",
  htmlFor,
  label,
  value,
  onChange,
  ...rest
}) => {
  return <>
    <label
      htmlFor={htmlFor}
      className={styles.label}
    >
      {label}
    </label>
    <input
      id={htmlFor}
      className={styles.input}
      type={type}
      onChange={onChange}
      value={value}
      {...rest}
    />
  </>
}
