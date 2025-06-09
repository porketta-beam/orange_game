import React from "react";
import styles from "./Grid.module.css";

export default function Cell({ cell, onSelect }) {
  const handleClick = () => onSelect(cell);
  return (
    <div className={styles.cell} onClick={handleClick}>
      {cell.isBomb ? "💣" : cell.value}
    </div>
  );
}
