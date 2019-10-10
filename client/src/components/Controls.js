import React, { memo, useState, useCallback } from 'react';
import { getColorsFromImage } from "../utils/requests";
import { BlockType } from "../utils/Block";
import { MenuIcon } from "../icons/Menu.js"

import cx from "classnames";
import styles from './Controls.module.scss';

function isDataInvalid(data) {
  return !data || !data.length || typeof data[0] !== "string";
}

export const Controls = memo(({
  isLoading,
  setIsLoading,
  setColors,
  setBlockType,
  numberOfBlocks,
  setNumberOfBlocks,
}) => {
  const [url, setUrl] = useState("");
  const [isActive, toggleState] = useState(false);

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
        onClick={() => toggleState(!isActive)}
      >
        <MenuIcon />
      </div>

      <div className={styles.controls}>
        <input
          className={styles.urlInput}
          type="text"
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Image URL"
        />
        <input
          className={styles.numberOfBlocksInput}
          type="number"
          min={0}
          value={numberOfBlocks}
          onChange={(e) => setNumberOfBlocks(+e.target.value)}
          placeholder="Input the number of color blocks you want displayed"
        />
        <select
          className={styles.blockType}
          onChange={(e) => setBlockType(e.target.value)}
        >
          <option value={"Default"}>Default</option>
          {Object.keys(BlockType).map((type) => {
            return <option value={BlockType[type]} key={type}>{BlockType[type]}</option>
          })}
        </select>
        <button
          className={styles.button}
          onClick={() => getColors()}
          disabled={isLoading}
        >
          Get Colors
        </button>
      </div>
    </div>
  );
});
