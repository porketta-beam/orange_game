import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import GameContainer from "./components/GameContainer/GameContainer";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard";
import TimeGauge from "./components/TimeGauge/TimeGauge";
import ScoreModal from "./components/ScoreModal/ScoreModal";
import { initializeGrid } from "./utils";
import "./assets/styles/global.css";

export default function App() {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showScoreModal, setShowScoreModal] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setShowScoreModal(true);
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setGrid(initializeGrid(20, 10));
    setScore(0);
    setTimeLeft(120);
    setIsPlaying(true);
    setShowScoreModal(false);
  };

  return (
    <>
      <Header title="오렌지 게임" onPlay={startGame} />
      <ScoreBoard score={score} />
      <TimeGauge timeLeft={timeLeft} totalTime={120} />
      <GameContainer
        isPlaying={isPlaying}
        grid={grid}
        onSelect={(cell) => {
          /* 선택 처리 */
        }}
        onReset={startGame}
        bgmEnabled={bgmEnabled}
        onToggleBgm={() => setBgmEnabled(!bgmEnabled)}
        volume={volume}
        onVolumeChange={(v) => setVolume(v)}
      />
      {showScoreModal && (
        <ScoreModal
          score={score}
          onRestart={startGame}
          onShare={() => {
            /* 공유 처리 */
          }}
        />
      )}
    </>
  );
}
