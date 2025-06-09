import React from "react";
import Grid from "../Grid/Grid";
import styles from "./GameContainer.module.css";

export default function GameContainer({ isPlaying, grid, onSelect }) {
  return (
    <div className={styles.container}>
      <Grid grid={grid} onSelect={onSelect} />
    </div>
  );
}
