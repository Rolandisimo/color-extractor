import React, { useState, useEffect, useCallback, memo } from 'react';
import { getColorsFromImage } from "./utils/requests";
import { Block } from "./utils/Block";
import { Loader } from "./Loader";
import styles from './App.module.css';

function isDataInvalid(data) {
  return !data || !data.length || typeof data[0] !== "string";
}

const MAX_BLOCKS = 1000;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [lastHoveredBlockIndex, setLastHoveredBlockIndex] = useState(-1);
  const [url, setUrl] = useState("");
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  });

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
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height)

    const totalArea = canvasDimensions.width * canvasDimensions.height;
    const colorArea = totalArea / (colors.length || 1);
    const x = Math.sqrt(colorArea / (canvasDimensions.width * canvasDimensions.height));

    let width = canvasDimensions.width * x;
    let height = canvasDimensions.height * x;

    let row = 1;
    let column = 1;

    setBlocks(colors.map((color) => {
      const delta = column * width - canvasDimensions.width;
      const hasReachedLastColumn = delta > 0;
      if (hasReachedLastColumn) {
        row++;
        column = 1;
      }

      const block = new Block({
        x: (column - 1) * width,
        y: (row - 1) * height,
        width,
        height,
        ctx,
        color,
      });
      block.update();
      block.draw();

      column++;

      return block;
    }));
  }, [colors, canvasDimensions]);

  const onMouseMove = useCallback((event) => {
    if (isLoading || !colors.length) {
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    const currentHoveredBlockIndex = blocks.findIndex((block) => {
      return (
        block.x < x
        && x < block.x
        && block.y < y
        && y < block.y
      );
    });

    console.count(currentHoveredBlockIndex)

    if (currentHoveredBlockIndex === -1) {
      return;
    }

    if (lastHoveredBlockIndex === currentHoveredBlockIndex) {
      return
    }

    setLastHoveredBlockIndex(currentHoveredBlockIndex);

    if (lastHoveredBlockIndex !== -1) {
      blocks[lastHoveredBlockIndex].onMouseExit();
    }

    blocks[currentHoveredBlockIndex].onMouseEnter();

  }, [isLoading, colors, blocks, lastHoveredBlockIndex]);

  return (
    <div className={styles.App}>
      <div className={styles.form}>
        <label htmlFor="url">Paste image url</label>
        <input className={styles.urlInput} type="text" id="url" onChange={(e) => setUrl(e.target.value)} />
        <button
          className={styles.button}
          onClick={() => getColors()}
          disabled={isLoading}
        >
          Submit
        </button>
      </div>
      <header className={styles.header}>
        {isLoading && <Loader />}
        <canvas id={styles.canvas} {...canvasDimensions} onMouseMove={onMouseMove}></canvas>
      </header>
    </div>
  );
}

export default memo(App);
