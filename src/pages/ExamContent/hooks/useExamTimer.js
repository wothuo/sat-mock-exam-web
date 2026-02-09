import { useEffect, useRef, useState } from 'react';
import { formatTime as formatTimeUtil } from '../utils/formatTime';

/**
 * 考试总倒计时
 * @param {boolean} examStarted
 * @param {string} timeMode - 'timed' | 'untimed'
 * @param {number} initialSeconds - 初始秒数
 */
export function useExamTimer(examStarted, timeMode, initialSeconds) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!examStarted || timeMode === 'untimed') return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [examStarted, timeMode]);

  return { timeRemaining, setTimeRemaining, formatTime: formatTimeUtil };
}
