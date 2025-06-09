// 부드럽게 감소하는 타이머 함수 (0.1초마다 0.1씩 감소)
export function startTimeCounter(initialTime, onTick, onEnd) {
  let timeLeft = initialTime;
  const interval = 100; // 0.1초(100ms)마다
  const step = 0.1;     // 0.1씩 감소

  const timer = setInterval(() => {
    timeLeft = Math.max(0, +(timeLeft - step).toFixed(1));
    if (onTick) onTick(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timer);
      if (onEnd) onEnd();
    }
  }, interval);
  return timer;
}