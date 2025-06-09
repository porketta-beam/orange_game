import React from "react";
import styles from "./ScoreModal.module.css";

export default function ScoreModal({ score, onRestart, onShare }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Your Score: {score}</h2>
        <button onClick={onRestart}>Restart</button>
        <button onClick={onShare}>Share</button>
      </div>
    </div>
  );
}
