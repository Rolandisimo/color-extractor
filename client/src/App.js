import React, { useState, useEffect, useCallback, memo } from 'react';
import { getColorsFromImage } from "./utils/requests";
import { Block, BlockType } from "./utils/Block";
import { Loader } from "./Loader";

import styles from './App.module.css';

function isDataInvalid(data) {
  return !data || !data.length || typeof data[0] !== "string";
}

function copyValueToClipboard(value) {
  const target = document.createElement("input");
  document.body.appendChild(target);
  target.id = "target";
  target.value = value;
  target.select();
  document.execCommand("copy");
  document.body.removeChild(target);
}

const MAX_BLOCKS = 2000;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [blockType, setBlockType] = useState();
  const [selectedColor, setSelectedColor] = useState("");
  const [lastHoveredBlockIndex, setLastHoveredBlockIndex] = useState(-1);
  const [url, setUrl] = useState("");
  const [canvasContainerInfo, setCanvasContainerInfo] = useState({
    width: 0,
    height: 0,
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

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setCanvasContainerInfo(node.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      measuredRef(document.querySelector(`.${styles.header}`));
    });
  }, [measuredRef])

  const selectColor = useCallback(() => {
    const lastHoveredBlock = blocks[lastHoveredBlockIndex];
    if (!lastHoveredBlock) {
      return;
    }
    setSelectedColor(lastHoveredBlock.originalColor);
    copyValueToClipboard(lastHoveredBlock.originalColor);
    setTimeout(() => setSelectedColor(""), 1000);
  }, [blocks, lastHoveredBlockIndex]);

  useEffect(() => {
    const canvas = document.getElementById(styles.canvas)
    const ctx = canvas.getContext("2d")
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvasContainerInfo.width, canvasContainerInfo.height)

    const totalArea = canvasContainerInfo.width * canvasContainerInfo.height;
    const colorArea = totalArea / (colors.length || 1);

    let divideBy;
    switch(blockType) {
      case BlockType.circle: {
        divideBy = canvasContainerInfo.width * canvasContainerInfo.width;
        break;
      }

      default:
        divideBy = canvasContainerInfo.width * canvasContainerInfo.height;
    }

    const ratio = Math.sqrt(colorArea / divideBy);

    const width = Math.round(canvasContainerInfo.width * ratio);
    const height = Math.round(canvasContainerInfo.height * ratio);

    let row = 1;
    let column = 1;

    setBlocks(colors.map((color) => {
      const delta = column * width - canvasContainerInfo.width;
      const hasReachedLastColumn = delta > 0;
      if (hasReachedLastColumn) {
        row++;
        column = 1;
      }

      const block = new Block({
        column: column - 1,
        row: row - 1,
        width,
        height,
        ctx,
        color,
        type: blockType,
      });
      block.update();
      block.draw();

      column++;

      return block;
    }));
  }, [colors, canvasContainerInfo, blockType]);

  const onMouseMove = useCallback((event) => {
    if (isLoading || !colors.length) {
      return;
    }

    const x = Math.abs(event.clientX - canvasContainerInfo.left);
    const y = Math.abs(event.clientY - canvasContainerInfo.top);

    const currentHoveredBlockIndex = blocks.findIndex((block) => {
      return (
        block.x <= x
        && x <= block.x + block.width
        && block.y <= y
        && y <= block.y + block.height
      );
    });

    if (currentHoveredBlockIndex === -1 || lastHoveredBlockIndex === currentHoveredBlockIndex) {
      return;
    }

    if (lastHoveredBlockIndex !== -1) {
      blocks[lastHoveredBlockIndex].onMouseExit();
    }
    blocks[currentHoveredBlockIndex].onMouseEnter();

    setLastHoveredBlockIndex(currentHoveredBlockIndex);
  }, [isLoading, colors, blocks, lastHoveredBlockIndex, canvasContainerInfo]);

  return (
    <div className={styles.App}>
      <div className={styles.form}>
        <input
          id="url"
          className={styles.urlInput}
          type="text"
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Image URL"
        />
        <select
          id="url"
          type="text"
          onChange={(e) => {
            console.log(e.target.value)
            setBlockType(e.target.value)
          }}
          placeholder="Block type"
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
      {blocks[lastHoveredBlockIndex] && (
        <div className={styles.metaInfo} style={{ color: blocks[lastHoveredBlockIndex].originalColor }}>
          {blocks[lastHoveredBlockIndex].originalColor}
        </div>
      )}
      <header className={styles.header} ref={measuredRef}>
        {isLoading && <Loader />}
        <canvas
          id={styles.canvas}
          onMouseMove={onMouseMove}
          width={canvasContainerInfo.width}
          height={canvasContainerInfo.height}
          onClick={selectColor}
        />
      </header>
      {selectedColor && (
        <div className={styles.selectedColor} style={{ color: selectedColor }}>
          {selectedColor}<br/>
          <span className={styles.selectedColorSubtext}>copied to clipboard</span>
        </div>
      )}
    </div>
  );
}

export default memo(App);
