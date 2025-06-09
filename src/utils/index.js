// src/utils/index.js

/**
 * 20×10 셀 배열을 생성하고, 1~9 랜덤 값과 10% 미만 확률의 폭탄을 배치합니다.
 * @param {number} rows
 * @param {number} cols
 * @returns {Cell[][]}
 */
export function initializeGrid(rows = 20, cols = 10) {
  const grid = [];
  let idCounter = 0;
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const isBomb = Math.random() < 0.02;
      const value = isBomb ? null : Math.floor(Math.random() * 9) + 1;
      row.push({
        id: `cell-${idCounter++}`,
        value,
        isBomb,
        row: r,
        col: c,
        cleared: false,
      });
    }
    grid.push(row);
  }
  return grid;
}
