'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Timer } from '../ui/Timer';

export interface CountdownTimerProps {
  startTime: string | null;
  timeLimitSeconds: number;
  onExpire?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  startTime,
  timeLimitSeconds,
  onExpire,
  size = 'md',
}) => {
  const [remaining, setRemaining] = useState<number>(timeLimitSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    hasExpiredRef.current = false;

    if (!startTime) {
      setRemaining(timeLimitSeconds);
      return;
    }

    const startTimestamp = new Date(startTime).getTime();
    const durationMs = timeLimitSeconds * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimestamp;
      const leftMs = durationMs - elapsed;
      const leftSec = Math.max(0, leftMs / 1000);

      setRemaining(leftSec);

      if (leftSec <= 0) {
        clearInterval(interval);
        if (!hasExpiredRef.current) {
          hasExpiredRef.current = true;
          onExpireRef.current?.();
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, timeLimitSeconds]);

  return <Timer remainingSeconds={remaining} totalSeconds={timeLimitSeconds} size={size} />;
};
