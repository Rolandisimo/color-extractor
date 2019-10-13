import React, { memo, useState, useCallback, useEffect } from 'react';
import cx from "classnames";
import { getColorsFromImage } from "../utils/requests";
import { MenuIcon } from "../icons/Menu"
import { FormGroup } from "./FormGroup/FormGroup"
import { Input } from "./FormGroup/Input"

import styles from './Controls.module.scss';

function isDataInvalid(data) {
  return !data || !data.length || typeof data[0] !== "string";
}

export const Controls = memo(({
  isLoading,
  setIsLoading,
  setColors,
  numberOfBlocks,
  setNumberOfBlocks,
}) => {
  const [url, setUrl] = useState("");
  const [isActive, toggleIsActive] = useState(false);

  useEffect(() => {
    const callback = (e) => {
      if (e.code === "Escape" || e.key === "Escape" || e.keyCode === 27) {
        toggleIsActive((state) => !state);
      }
    };
    document.addEventListener("keydown", callback);

    return () => document.removeEventListener("keydown", callback);
  }, [])

  const getColors = useCallback(() => {
    if (!url || isLoading) {
      return Promise.resolve();
    };

    setColors([])
    setIsLoading(true);

    return new Promise(async (resolve, reject) => {
      try {
        const response = await getColorsFromImage(url);
        const data = await response.json()

        setIsLoading(false);

        if (isDataInvalid(data)) {
          return reject();
        }

        setColors(data);
        resolve();
      } catch {}
    });
  }, [
    url,
    isLoading,
    setIsLoading,
    setColors,
  ]);

  return (
    <div className={cx(styles.container, { [styles.active]: isActive } )} >
      <div
        className={cx(styles.menuIconContainer, { [styles.active]: isActive })}
        onClick={() => toggleIsActive(!isActive)}
      >
        <MenuIcon />
      </div>

      <div className={styles.controls}>
        <FormGroup>
          <Input
            htmlFor={"image-url"}
            onChange={(e) => setUrl(e.target.value)}
            label={"Image URL"}
          />
        </FormGroup>
        <FormGroup>
          <Input
            htmlFor={"image-url"}
            onChange={(e) => setNumberOfBlocks(+e.target.value)}
            label={"Number of colors"}
            placeholder={"How many colors to display"}
            min={0}
            type="number"
            value={numberOfBlocks}
          />
        </FormGroup>
        <FormGroup>
          <button
            className={styles.button}
            onClick={getColors}
            disabled={isLoading}
          >
            Extract colors
          </button>
        </FormGroup>
      </div>
    </div>
  );
});
