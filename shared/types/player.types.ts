/**
 * Chemistry Live: Player Types
 */

export interface Player {
  id: string;
  session_id: string;
  nickname: string;
  score: number;
  streak: number;
  is_connected: boolean;
  joined_at: string;
  last_active_at: string;
}

export interface PlayerAnswer {
  id: string;
  session_id: string;
  player_id: string;
  question_id: string;
  selected_option_id: string | null;
  is_correct: boolean;
  response_time_ms: number;
  points_awarded: number;
  streak_at_answer: number;
  created_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  nickname: string;
  score: number;
  streak: number;
  isCurrentPlayer?: boolean;
  scoreDelta?: number;
}
