import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import GameContainer from "./components/GameContainer/GameContainer";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard";
import TimeGauge from "./components/TimeGauge/TimeGauge";
import ScoreModal from "./components/ScoreModal/ScoreModal";
import Grid from "./components/Grid/Grid";
import { initializeGrid } from "./utils";
import "./assets/styles/global.css";

export default function App() {
  // --- 기존 상태 ---
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  // --- 드래그 오버레이 상태 ---
  const [dragStart, setDragStart] = useState(null);
  const [dragRect, setDragRect] = useState(null);

  // 게임 초기화
  const startGame = () => {
    setGrid(initializeGrid(20, 10));
    setScore(0);
    setTimeLeft(120);
    setIsPlaying(true);
    setShowScoreModal(false);
  };

  // 전역 mousemove / mouseup 바인딩
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragStart) return;
      const x = Math.min(dragStart.x, e.clientX);
      const y = Math.min(dragStart.y, e.clientY);
      const w = Math.abs(e.clientX - dragStart.x);
      const h = Math.abs(e.clientY - dragStart.y);
      setDragRect({ x, y, width: w, height: h });
    };
    const onMouseUp = () => {
      setDragStart(null);
      setDragRect(null);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragStart]);

  return (
    <div
      className="game-wrapper"
      onMouseDown={(e) => setDragStart({ x: e.clientX, y: e.clientY })}
    >
      {!isPlaying ? (
        <div className="welcome-screen">
          <Header title="오렌지 게임" onPlay={startGame} />
        </div>
      ) : (
        <>
          <Header title="오렌지 게임" onPlay={startGame} />
          <ScoreBoard score={score} />
          <TimeGauge timeLeft={timeLeft} totalTime={120} />
          <GameContainer
            isPlaying={isPlaying}
            grid={grid}
            onSelect={() => {}}
            onReset={startGame}
          />
          {showScoreModal && (
            <ScoreModal
              score={score}
              onRestart={startGame}
              onShare={() => {}}
            />
          )}
        </>
      )}

      {/* 드래그 오버레이 */}
      {dragRect && (
        <div
          className="drag-rect"
          style={{
            left: `${dragRect.x}px`,
            top: `${dragRect.y}px`,
            width: `${dragRect.width}px`,
            height: `${dragRect.height}px`,
          }}
        />
      )}
    </div>
  );
}
