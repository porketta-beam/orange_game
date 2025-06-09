import React from "react";
import styles from "./Header.module.css";

export default function Header({ title, onPlay }) {
  return (
    <header className={styles.header}>
      <h1>{title}</h1>
      <button onClick={onPlay}>Play</button>
    </header>
  );
}
