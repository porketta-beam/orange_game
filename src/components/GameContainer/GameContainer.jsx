import React from "react";
import Grid from "../Grid/Grid";
import ResetButton from "../Controls/ResetButton";
import styles from "./GameContainer.module.css";

export default function GameContainer({
  isPlaying,
  grid,
  onSelect,
  onReset,
  bgmEnabled,
  onToggleBgm,
  volume,
  onVolumeChange,
}) {
  return (
    <main className={styles.container}>
      {isPlaying ? (
        <>
          <Grid grid={grid} onSelect={onSelect} />
          <ResetButton onClick={onReset} />
          {/* BGM 토글, 볼륨 슬라이더 컴포넌트 추가 예정 */}
        </>
      ) : (
        <button onClick={onReset}>Start</button>
      )}
    </main>
  );
}
