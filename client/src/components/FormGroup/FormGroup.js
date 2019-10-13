import React from "react";
import styles from "./FormGroup.module.scss";

export const FormGroup = ({ children }) => {
  return (
    <div className={styles.formGroup}>
      {children}
    </div>
  );
}
