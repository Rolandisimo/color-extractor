import React, { memo } from 'react';

import styles from './MetaInfo.module.scss';

export const MetaInfo = memo(({ color, numberOfColors }) => {
  if (!color) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div style={{ color }}>
        {color}.
      </div>
      <div>Total of {numberOfColors} colors</div>
    </div>
  );
});
