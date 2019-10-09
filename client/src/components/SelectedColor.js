import React, { memo } from 'react';
import { getContrastColor } from "../utils/colors";

import styles from "./SelectedColor.module.scss";

export const SelectedColor = memo(({ selectedColor }) => {
  if (!selectedColor) {
    return null;
  }

  return (
    <div
      className={styles.selectedColor}
      style={{ backgroundColor: selectedColor, color: getContrastColor(selectedColor) }}
    >
      {selectedColor}<br/>
      <span className={styles.selectedColorSubtext}>copied to clipboard</span>
    </div>
  );
});
