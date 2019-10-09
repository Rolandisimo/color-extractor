import React, { useState, useCallback, memo } from 'react';
import { getColorsFromImage } from "../utils/requests";
import { BlockType } from "../utils/Block";

import styles from './Forms.module.scss';

function isDataInvalid(data) {
  return !data || !data.length || typeof data[0] !== "string";
}

const MAX_BLOCKS = 2000;

export const Forms = memo(({
  isLoading,
  setIsLoading,
  setColors,
  setBlockType,
}) => {
  const [url, setUrl] = useState("");

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

        setColors(data.slice(0, MAX_BLOCKS + 1));
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
    <div className={styles.form}>
      <input
        className={styles.urlInput}
        type="text"
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Image URL"
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
  );
});
