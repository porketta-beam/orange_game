import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import GameContainer from "./components/GameContainer/GameContainer";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard";
import TimeGauge from "./components/TimeGauge/TimeGauge";
import ScoreModal from "./components/ScoreModal/ScoreModal";
import Grid from "./components/Grid/Grid";
import { initializeGrid } from "./utils";
import { startTimeCounter } from "./utils/timecounter";
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
      const selectedCells = grid.flatMap((row) =>
        row.filter((cell) => {
          if (cell.cleared) return false;

          const cellElement = document.querySelector(
            `[data-cell-id="${cell.id}"]`
          );
          if (!cellElement) return false;

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
      console.log(
        "Selected cells:",
        selectedCells.map((cell) => cell.value)
      );
      console.log(`Selected cells sum: ${sum}`);
    };

    const onMouseUp = (e) => {
      if (!dragStart) return;

      // 마우스 업 시점에 선택된 셀들의 합계를 체크
      const selectedCells = grid.flatMap((row) =>
        row.filter((cell) => {
          if (cell.cleared) return false;

          const cellElement = document.querySelector(
            `[data-cell-id="${cell.id}"]`
          );
          if (!cellElement) return false;

          const rect = cellElement.getBoundingClientRect();
          return !(
            rect.right < dragRect.x ||
            rect.left > dragRect.x + dragRect.width ||
            rect.bottom < dragRect.y ||
            rect.top > dragRect.y + dragRect.height
          );
        })
      );

      // 폭탄이 선택된 경우
      const bombCell = selectedCells.find((cell) => cell.isBomb);
      if (bombCell) {
        setGrid((prevGrid) => {
          const newGrid = prevGrid.map((row) =>
            row.map((cell) => ({ ...cell }))
          );
          const rows = newGrid.length;
          const cols = newGrid[0].length;

          // 8방향
          const deltas = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
          ];

          let bonus = 0;

          // 주변 셀들 50% 확률로 제거
          deltas.forEach(([dr, dc]) => {
            const nr = bombCell.row + dr;
            const nc = bombCell.col + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              const neighbor = newGrid[nr][nc];
              // 50% 확률로 제거
              if (!neighbor.cleared && Math.random() < 0.5) {
                neighbor.cleared = true;
                bonus += neighbor.value || 0;
              }
            }
          });

          // 폭탄 자신은 항상 제거
          newGrid[bombCell.row][bombCell.col].cleared = true;

          // 보너스 점수 추가
          setScore((prev) => prev + bonus);

          return newGrid;
        });
      } else {
        // 일반 숫자 합계 처리
        const sum = selectedCells.reduce((acc, cell) => {
          if (cell.isBomb) return acc;
          return acc + (cell.value || 0);
        }, 0);

        // 합이 10이면 선택된 셀들을 제거하고 점수 추가
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
          setScore((prev) => prev + 10);
        }
      }

      // 드래그 상태 초기화
      setDragStart(null);
      setDragRect(null);
    };

    // 마우스가 게임 영역을 벗어났을 때도 드래그 상태 초기화
    const onMouseLeave = () => {
      if (dragStart) {
        setDragStart(null);
        setDragRect(null);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [dragStart, grid, dragRect]);

  const [timerId, setTimerId] = useState(null);

  // 게임 시작 시 타이머 시작
  useEffect(() => {
    if (isPlaying) {
      // 기존 타이머가 있다면 정지
      if (timerId) clearInterval(timerId);
      const id = startTimeCounter(120, (newTimeLeft) => {
        setTimeLeft(newTimeLeft);
        if (newTimeLeft <= 0) {
          setIsPlaying(false);
          setShowScoreModal(true);
        }
      });
      setTimerId(id);
    } else {
      // 게임이 끝나면 타이머 정지
      if (timerId) clearInterval(timerId);
    }
    // 언마운트 시 타이머 정지
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isPlaying]);

  return (
    <div className="game-wrapper">
      {!isPlaying ? (
        <div className="welcome-screen">
          <Header title="오렌지 게임" onPlay={startGame} />
        </div>
      ) : (
        <>
          <Header title="오렌지 게임" onPlay={startGame} />
          <ScoreBoard score={score} />
          <TimeGauge timeLeft={timeLeft} totalTime={120} />
          <div
            className="game-area"
            onMouseDown={(e) => {
              // 게임 영역 내에서만 드래그 시작
              if (e.target.closest(".game-area")) {
                setDragStart({ x: e.clientX, y: e.clientY });
              }
            }}
          >
            <GameContainer
              isPlaying={isPlaying}
              grid={grid}
              onSelect={() => {}}
              onReset={startGame}
            />
          </div>
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
