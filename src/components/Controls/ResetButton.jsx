import React from "react";
import styles from "./Controls.module.css";

export default function ResetButton({ onClick }) {
  return (
    <button className={styles.resetButton} onClick={onClick}>
      Reset
    </button>
  );
}
