/**
 * Chemistry Live: Game Constants
 */

export const GAME_STATUS = {
  LOBBY: 'lobby',
  QUESTION_ACTIVE: 'question_active',
  QUESTION_REVIEW: 'question_review',
  LEADERBOARD: 'leaderboard',
  GAME_OVER: 'game_over',
  CANCELLED: 'cancelled',
} as const;

export type GameStatusType = typeof GAME_STATUS[keyof typeof GAME_STATUS];

export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  ULTRA_HARD: 'ultra_hard',
} as const;

export type DifficultyType = typeof DIFFICULTY[keyof typeof DIFFICULTY];

export const TIME_LIMITS = {
  [DIFFICULTY.EASY]: 20,
  [DIFFICULTY.MEDIUM]: 30,
  [DIFFICULTY.ULTRA_HARD]: 45,
} as const;

export const BASE_POINTS = {
  [DIFFICULTY.EASY]: 1000,
  [DIFFICULTY.MEDIUM]: 1500,
  [DIFFICULTY.ULTRA_HARD]: 2000,
} as const;

export const ANSWER_COLORS = {
  RED: '#E21B3C',
  BLUE: '#1368CE',
  YELLOW: '#D89E00',
  GREEN: '#26890C',
} as const;

export const ANSWER_COLOR_NAMES = ['red', 'blue', 'yellow', 'green'] as const;
export type AnswerColorName = typeof ANSWER_COLOR_NAMES[number];

export const PIN_LENGTH = 6;
export const MIN_NICKNAME_LENGTH = 2;
export const MAX_NICKNAME_LENGTH = 20;
