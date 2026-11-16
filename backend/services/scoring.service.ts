/**
 * Scoring service for calculating answer points based on speed and accuracy
 */

export function calculateScore(basePoints: number, responseTimeMs: number, timeLimitMs: number): number {
  const safeTimeLimit = Math.max(1000, timeLimitMs);
  const ratio = Math.max(0, Math.min(1.0, responseTimeMs / safeTimeLimit));
  const speedMultiplier = Math.max(0.5, Math.min(1.0, 0.5 + 0.5 * (1 - ratio)));
  return Math.round(basePoints * speedMultiplier);
}

export function computeAnswerPoints(
  isCorrect: boolean,
  basePoints: number,
  responseTimeMs: number,
  timeLimitSeconds: number,
  currentStreak: number
): { points: number; newStreak: number } {
  if (!isCorrect) {
    return { points: 0, newStreak: 0 };
  }

  const speedScore = calculateScore(basePoints, responseTimeMs, timeLimitSeconds * 1000);
  const newStreak = currentStreak + 1;
  const streakBonus = Math.min(newStreak, 5) * 100;

  return {
    points: speedScore + streakBonus,
    newStreak,
  };
}
