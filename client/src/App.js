import React, { useState, useEffect, useCallback, memo } from 'react';
import { Block, BlockType } from "./utils/Block";
import { copyValueToClipboard } from "./utils/copyValueToClipboard";
import { Loader } from "./components/Loader";
import { SelectedColor } from "./components/SelectedColor";
import { MetaInfo } from "./components/MetaInfo";
import { Controls } from "./components/Controls";

import styles from './App.module.scss';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [blockType, setBlockType] = useState();
  const [numberOfBlocks, setNumberOfBlocks] = useState(2000);
  const [selectedColor, setSelectedColor] = useState("");
  const [lastHoveredBlockIndex, setLastHoveredBlockIndex] = useState(-1);
  const [canvasContainerInfo, setCanvasContainerInfo] = useState({ width: 0, height: 0 });

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setCanvasContainerInfo(node.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      measuredRef(document.querySelector(`.${styles.canvasContainer}`));
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
    ctx.clearRect(0, 0, canvasContainerInfo.width, canvasContainerInfo.height)

    const totalArea = canvasContainerInfo.width * canvasContainerInfo.height;
    const colorArea = totalArea / (numberOfBlocks || 1);

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

    setBlocks(colors.slice(0, numberOfBlocks).map((color) => {
      const hasReachedLastColumn = column * width > canvasContainerInfo.width;
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
  }, [colors, canvasContainerInfo, blockType, numberOfBlocks]);

  const onMouseMove = useCallback((event) => {
    if (isLoading || !numberOfBlocks) {
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

    if (lastHoveredBlockIndex !== -1 && blocks[lastHoveredBlockIndex]) {
      blocks[lastHoveredBlockIndex].onMouseExit();
    }
    if (blocks[currentHoveredBlockIndex]) {
      blocks[currentHoveredBlockIndex].onMouseEnter();
    }

    setLastHoveredBlockIndex(currentHoveredBlockIndex);
  }, [isLoading, blocks, lastHoveredBlockIndex, canvasContainerInfo, numberOfBlocks]);

  return (
    <div className={styles.container}>
      <Controls
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setColors={setColors}
        setBlockType={setBlockType}
        setNumberOfBlocks={setNumberOfBlocks}
        numberOfBlocks={numberOfBlocks}
      />
      {blocks[lastHoveredBlockIndex] && (
        <MetaInfo color={blocks[lastHoveredBlockIndex].originalColor} />
      )}

      <div className={styles.canvasContainer} ref={measuredRef}>
        {isLoading && <Loader />}
        <canvas
          id={styles.canvas}
          onMouseMove={onMouseMove}
          onClick={selectColor}
          width={canvasContainerInfo.width}
          height={canvasContainerInfo.height}
        />
      </div>
      <SelectedColor selectedColor={selectedColor} />
    </div>
  );
}

export default memo(App);
