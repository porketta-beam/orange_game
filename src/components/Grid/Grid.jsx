import React from "react";
import Cell from "./Cell";
import styles from "./Grid.module.css";

export default function Grid({ grid, onSelect }) {
  return (
    <div className={styles.grid}>
      {grid.map((row) =>
        row.map((cell) => (
          <Cell key={cell.id} cell={cell} onSelect={onSelect} />
        ))
      )}
    </div>
  );
}
