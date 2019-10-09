import React, { memo } from 'react';

import styles from './MetaInfo.module.scss';

export const MetaInfo = memo(({ color }) => {
  if (!color) {
    return null;
  }

  return (
    <div className={styles.metaInfo} style={{ color }}>
      {color}
    </div>
  );
});
