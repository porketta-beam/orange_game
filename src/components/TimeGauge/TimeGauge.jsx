import React from "react";
import styles from "./TimeGauge.module.css";

export default function TimeGauge({ timeLeft, totalTime }) {
  const pct = (timeLeft / totalTime) * 100;
  return (
    <div className={styles.timeGauge}>
      <div className={styles.fill} style={{ width: `${pct}%` }} />
    </div>
  );
}
