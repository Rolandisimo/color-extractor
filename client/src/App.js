import React, { useState, useEffect, useCallback, memo } from 'react';
import { getColorsFromImage } from "./utils/requests";
import { Loader } from "./Loader";
import styles from './App.module.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [url, setUrl] = useState("");
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  });

  const getColors = useCallback(() => {
    if (!url || isLoading) {
      return;
    };

    setColors([])
    setIsLoading(true);


  // const getColors = useCallback(() => {
  //   if (!url || isLoading) {
  //     return;
  //   };

  //   setColors([])
  //   setIsLoading(true);


  //   getColorsFromImage(url).then(async (response) => {
  //     const data = await response.json()
  //     setColors(data);
  //   }).finally(() => setIsLoading(false));

    new Promise(async (resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        reject();
      }, 10000)

      try {
        const response = await getColorsFromImage(url);
        const data = await response.json()
        setColors(data);
        setIsLoading(false);
        resolve();
      } catch {}
    });
  }, [url, isLoading]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setCanvasDimensions({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
    });
  }, [])

  useEffect(() => {
    const canvas = document.getElementById(styles.canvas);
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height)

    const totalPixels = canvasDimensions.width * canvasDimensions.height;
    const pixelsForColor = totalPixels / (colors.length || 1);
    const blockSize = Math.sqrt(pixelsForColor);
    let width = blockSize;
    let height = blockSize;

    let row = 1;
    let column = 1;

    colors.forEach((color) => {
      const delta = column * width - canvasDimensions.width;
      const hasReachedLastColumn = delta > 0;
      if (hasReachedLastColumn) {
        row++;
        column = 1;
      }

      const x = (column - 1) * width;
      const y = (row - 1) * height;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);

      column++;
    });
  }, [colors, canvasDimensions])

  return (
    <div className={styles.App}>
      <div className={styles.form}>
        <label htmlFor="url">Paste image url</label>
        <input className={styles.urlInput} type="text" id="url" onChange={(e) => setUrl(e.target.value)} />
        <button className={styles.button} onClick={() => getColors()} disabled={isLoading}>Submit</button>
      </div>
      <header className={styles.header}>
        {isLoading && <Loader />}
        <canvas id={styles.canvas} {...canvasDimensions}></canvas>
      </header>
    </div>
  );
}

export default memo(App);
