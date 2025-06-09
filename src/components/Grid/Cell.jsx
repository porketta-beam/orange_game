import React from "react";
import styles from "./Grid.module.css";

export default function Cell({ cell, isSelected, onMouseDown, onMouseEnter }) {
  if (cell.cleared)
    return (
      <div
        className={styles.cell + " " + styles.cleared}
        data-cell-id={cell.id}
      />
    );

  return (
    <div
      className={`${styles.cell} ${isSelected ? styles.selected : ""}`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      className={styles.cell}
      data-cell-id={cell.id}
      style={cell.isBomb ? { fontSize: "2rem" } : {}}
    >
      {cell.isBomb ? "💣" : cell.value}
    </div>
  );
}
