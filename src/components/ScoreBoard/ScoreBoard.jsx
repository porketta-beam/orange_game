import React from "react";
import styles from "./ScoreBoard.module.css";

export default function ScoreBoard({ score }) {
  return <div className={styles.scoreBoard}>Score: {score}</div>;
}
