"use client";
import { RotatingLines } from "react-loader-spinner";
import styles from "./CustomLoader.module.css";
const CustomLoader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.overlay}></div>
      <div className={styles.loader}>
        <RotatingLines
          visible={true}
          width="40"
          strokeWidth="4"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          strokeColor="#03A9F4"
        />
      </div>
    </div>
  );
};

export default CustomLoader;
