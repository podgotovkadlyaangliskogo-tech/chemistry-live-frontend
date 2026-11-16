/**
 * Chemistry Live: API Request & Response Types
 */

import { GameSession, GameStatus } from './game.types';
import { Player, LeaderboardEntry } from './player.types';
import { QuestionWithOptions, QuestionWithCorrectAnswer } from './quiz.types';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// 1. Join Room
export interface JoinRoomRequest {
  pin_code: string;
  nickname: string;
}

export interface JoinRoomResponse {
  session: GameSession;
  player: Player;
}

// 2. Create Session
export interface CreateSessionRequest {
  quiz_id: string;
  host_id?: string;
}

export interface CreateSessionResponse {
  session: GameSession;
}

// 3. Submit Answer
export interface SubmitAnswerRequest {
  session_id: string;
  player_id: string;
  question_id: string;
  selected_option_id: string;
  response_time_ms: number;
}

export interface SubmitAnswerResponse {
  is_correct: boolean;
  points_awarded: number;
  new_score: number;
  new_streak: number;
}

// 4. Session Controls (Host)
export interface StartGameRequest {
  session_id: string;
}

export interface StartGameResponse {
  session: GameSession;
  first_question: QuestionWithOptions;
}

export interface NextQuestionRequest {
  session_id: string;
}

export interface NextQuestionResponse {
  session: GameSession;
  question?: QuestionWithOptions;
  status: GameStatus;
}

export interface RevealAnswerRequest {
  session_id: string;
}

export interface RevealAnswerResponse {
  session: GameSession;
  question_review: QuestionWithCorrectAnswer;
  leaderboard: LeaderboardEntry[];
}

export interface EndGameRequest {
  session_id: string;
}

export interface EndGameResponse {
  session: GameSession;
  final_leaderboard: LeaderboardEntry[];
}
