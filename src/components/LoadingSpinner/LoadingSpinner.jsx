
import React from 'react';
import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Cargando productos...</p>
    </div>
  );
};

export default LoadingSpinner;