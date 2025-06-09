import React from "react";
import styles from "./Grid.module.css";

export default function Cell({ cell, onSelect }) {
  if (cell.cleared) {
    return (
      <div
        className={styles.cell + " " + styles.cleared}
        data-cell-id={cell.id}
      />
    );
  }

  return (
    <div
      className={styles.cell}
      onClick={() => onSelect(cell)}
      data-cell-id={cell.id}
    >
      {cell.isBomb ? "💣" : cell.value}
    </div>
  );
}
