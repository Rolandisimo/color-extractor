import React, { useState, useEffect } from "react";
import styles from './Loader.module.scss';

const MAX_DOTS = 3;

export const Loader = () => {
  const ellipsis = "...";
  const [numberOfDots, setNumberOfDots] = useState(MAX_DOTS);
  useEffect(() => {
    const id = setInterval(() => {
      setNumberOfDots(numberOfDots > MAX_DOTS ? 0 : numberOfDots + 1)
    }, 400);

    return () => clearInterval(id);
  })

  return <h1 className={styles.loading}>Loading{ellipsis.slice(0, numberOfDots)}</h1>
}
