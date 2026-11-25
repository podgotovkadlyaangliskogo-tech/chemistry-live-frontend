'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTimer(startTime: string | null | undefined, timeLimitSeconds: number) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(timeLimitSeconds);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const calculateRemaining = useCallback(() => {
    if (!startTime) {
      return timeLimitSeconds;
    }
    // Supabase может вернуть timestamp без 'Z' — нормализуем к UTC
    const rawStart = startTime.endsWith('Z') || startTime.includes('+') || startTime.includes('-', 10)
      ? startTime
      : startTime + 'Z';
    const start = new Date(rawStart).getTime();
    const durationMs = timeLimitSeconds * 1000;
    const elapsed = Date.now() - start;
    const leftMs = durationMs - elapsed;
    return Math.max(0, leftMs / 1000);
  }, [startTime, timeLimitSeconds]);

  useEffect(() => {
    const left = calculateRemaining();
    setRemainingSeconds(left);
    setIsExpired(left <= 0);

    if (left <= 0) return;

    const interval = setInterval(() => {
      const currentLeft = calculateRemaining();
      setRemainingSeconds(currentLeft);
      if (currentLeft <= 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [calculateRemaining]);

  return { remainingSeconds, isExpired };
}
