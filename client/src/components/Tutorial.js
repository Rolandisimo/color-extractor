import React from "react";
import styles from "./Tutorial.module.scss";

const supported_extensions = [
  "png",
  "jpg",
];
export const Tutorial = () => {
  return (
    <div className={styles.container}>
      <ol className={styles.innerContainer}>
        <li>Press the burger icon on the top left</li>
        <li>Paste a link to or upload any {supported_extensions.join(", ")} image</li>
        <li>Adjust settings to your liking</li>
        <li>Extract colors</li>
        <li>Hover over a block to see its color</li>
        <li>Click/Tap on a block to copy the color code</li>
      </ol>
    </div>
  );
}
