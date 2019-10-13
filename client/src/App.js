import React, { useState, useEffect, useCallback, memo } from 'react';
import throttle from "lodash.throttle";
import { Block } from "./utils/Block";
import { copyValueToClipboard } from "./utils/copyValueToClipboard";
import { Loader } from "./components/Loader";
import { SelectedColor } from "./components/SelectedColor";
import { MetaInfo } from "./components/MetaInfo";
import { Controls } from "./components/Controls";
import { Tutorial } from "./components/Tutorial";

import styles from './App.module.scss';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [numberOfBlocks, setNumberOfBlocks] = useState(100);
  const [selectedColor, setSelectedColor] = useState("");
  const [lastHoveredBlockIndex, setLastHoveredBlockIndex] = useState(-1);
  const [canvasContainerInfo, setCanvasContainerInfo] = useState({ width: 0, height: 0 });

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setCanvasContainerInfo(node.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    const callback = throttle(() => {
      measuredRef(document.querySelector(`.${styles.canvasContainer}`));
    }, 1000, { leading: true, trailiing: true });
    window.addEventListener("resize", callback);

    return () => window.removeEventListener("resize", callback)
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

  const getBlockPositions = useCallback((width, height, hasRecalculated) => {
    const usableColors = colors.slice(0, numberOfBlocks);


    let row = 0;
    let column = 0;

    const colorBlocks = [];

    for (let color of usableColors) {
      const deltaOverflow = ((column + 1) * width) - canvasContainerInfo.width;

      if (!hasRecalculated && deltaOverflow > 0) {
        const newWidth = canvasContainerInfo.width / (column + 1);
        const decreaseRatio = width / newWidth;
        return getBlockPositions(
          newWidth,
          height / decreaseRatio,
          true,
        );
      }

      if (deltaOverflow > 0) {
        row++;
        column = 0;
      }

      colorBlocks.push({
        column,
        row,
        width,
        height,
        color,
      });

      column++;
    }

    return colorBlocks;
  }, [colors, numberOfBlocks, canvasContainerInfo]);

  useEffect(() => {
    const canvas = document.getElementById(styles.canvas)
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvasContainerInfo.width, canvasContainerInfo.height)

    const totalArea = canvasContainerInfo.width * canvasContainerInfo.height;
    const colorArea = totalArea / Math.min(colors.length || 1, numberOfBlocks);
    const ratio = Math.sqrt(colorArea / totalArea);
    const width = canvasContainerInfo.width * ratio;
    const height = canvasContainerInfo.height * ratio;

    setBlocks(getBlockPositions(width, height).map((positionInfo) => {
      const block = new Block({
        ...positionInfo,
        ctx,
      });
      block.update();
      block.draw();
      return block;
    }));
  }, [colors, canvasContainerInfo, numberOfBlocks, getBlockPositions]);

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
        setNumberOfBlocks={setNumberOfBlocks}
        numberOfBlocks={numberOfBlocks}
      />
      {blocks[lastHoveredBlockIndex] && (
        <MetaInfo
          color={blocks[lastHoveredBlockIndex].originalColor}
          numberOfColors={colors.length}
        />
      )}

      <div className={styles.canvasContainer} ref={measuredRef}>
        {isLoading && <Loader />}
        <Tutorial />
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
