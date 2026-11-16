/**
 * Chemistry Live: Scoring Formula & Constants
 *
 * Scoring Formula:
 * - When an answer is incorrect: points = 0, streak resets to 0.
 * - When an answer is correct:
 *     speedFactor = 1 - (responseTimeMs / (timeLimitSeconds * 1000)) / 2
 *     speedMultiplier = clamp(speedFactor, MIN_SPEED_MULTIPLIER, MAX_SPEED_MULTIPLIER)
 *     baseAward = round(basePoints * speedMultiplier)
 *     streakBonus = min(streak, MAX_STREAK_BONUS_TIER) * STREAK_BONUS_PER_LEVEL
 *     totalPoints = baseAward + streakBonus
 */

export const MIN_SPEED_MULTIPLIER = 0.5;
export const MAX_SPEED_MULTIPLIER = 1.0;

export const STREAK_BONUS_PER_LEVEL = 100;
export const MAX_STREAK_BONUS_TIER = 5;

/**
 * Calculates score for a question answer.
 * @param isCorrect Whether the answer was correct
 * @param basePoints Base points for the question difficulty (e.g., 1000, 1500, 2000)
 * @param responseTimeMs Player's reaction time in milliseconds
 * @param timeLimitSeconds Question time limit in seconds
 * @param currentStreak Player's streak before this question
 * @returns Object with points awarded, new streak, and breakdown
 */
export function calculateAnswerScore(
  isCorrect: boolean,
  basePoints: number,
  responseTimeMs: number,
  timeLimitSeconds: number,
  currentStreak: number
): {
  pointsAwarded: number;
  newStreak: number;
  speedMultiplier: number;
  streakBonus: number;
} {
  if (!isCorrect) {
    return {
      pointsAwarded: 0,
      newStreak: 0,
      speedMultiplier: 0,
      streakBonus: 0,
    };
  }

  const timeLimitMs = Math.max(timeLimitSeconds * 1000, 1000);
  const clampedResponseTime = Math.max(0, Math.min(responseTimeMs, timeLimitMs));

  // Scale from 1.0 down to 0.5 as response time approaches limit
  const rawMultiplier = 1 - (clampedResponseTime / timeLimitMs) * 0.5;
  const speedMultiplier = Math.max(
    MIN_SPEED_MULTIPLIER,
    Math.min(MAX_SPEED_MULTIPLIER, rawMultiplier)
  );

  const baseAward = Math.round(basePoints * speedMultiplier);
  const newStreak = currentStreak + 1;
  const streakBonus = Math.min(newStreak, MAX_STREAK_BONUS_TIER) * STREAK_BONUS_PER_LEVEL;

  return {
    pointsAwarded: baseAward + streakBonus,
    newStreak,
    speedMultiplier: Number(speedMultiplier.toFixed(4)),
    streakBonus,
  };
}
