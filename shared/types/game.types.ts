/**
 * Chemistry Live: Game Types
 */

export type GameStatus =
  | 'lobby'
  | 'question_active'
  | 'question_review'
  | 'leaderboard'
  | 'game_over'
  | 'cancelled';

export type Difficulty = 'easy' | 'medium' | 'ultra_hard';

export interface GameSession {
  id: string;
  quiz_id: string;
  host_id: string | null;
  pin_code: string;
  status: GameStatus;
  current_question_id: string | null;
  current_question_index: number;
  question_start_time: string | null; // ISO timestamp
  created_at: string;
  updated_at: string;
}

export interface GameResult {
  id: string;
  session_id: string;
  player_id: string;
  final_score: number;
  final_rank: number;
  correct_answers_count: number;
  total_questions: number;
  created_at: string;
}

export interface GameStateView {
  session: GameSession;
  totalQuestions: number;
  playersCount: number;
  activeQuestion?: {
    id: string;
    text: string;
    difficulty: Difficulty;
    points: number;
    timeLimitSeconds: number;
    orderIndex: number;
    options: {
      id: string;
      text: string;
      color: 'red' | 'blue' | 'yellow' | 'green';
      orderIndex: number;
    }[];
  };
}
