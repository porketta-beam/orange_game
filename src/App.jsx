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
    setGrid(initializeGrid(10, 15));
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

      // 드래그 영역 내의 셀들을 찾아서 선택 상태로 변경
      const selectedCells = grid.flatMap((row, rowIndex) =>
        row.filter((cell) => {
          const cellElement = document.querySelector(
            `[data-cell-id="${cell.id}"]`
          );
          if (!cellElement || cell.cleared) return false;

          const rect = cellElement.getBoundingClientRect();
          // 셀이 드래그 영역과 겹치는지 확인
          return !(
            rect.right < x ||
            rect.left > x + w ||
            rect.bottom < y ||
            rect.top > y + h
          );
        })
      );

      // 선택된 셀들의 숫자 합계 계산 (폭탄 제외)
      const sum = selectedCells.reduce((acc, cell) => {
        if (cell.isBomb) return acc;
        return acc + (cell.value || 0);
      }, 0);

      // 합이 10이면 선택된 셀들을 제거
      if (sum === 10) {
        setGrid((prevGrid) =>
          prevGrid.map((row) =>
            row.map((cell) =>
              selectedCells.some((selected) => selected.id === cell.id)
                ? { ...cell, cleared: true }
                : cell
            )
          )
        );
        setScore((prev) => prev + sum);
      }
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
          <Header title="오렌지 게임" />
          <button onClick={startGame}>Play</button>
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
