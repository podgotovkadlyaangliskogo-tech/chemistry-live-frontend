/**
 * Chemistry Live: Quiz & Question Types
 */

import { Difficulty } from './game.types';

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  author_id: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  text: string;
  explanation: string | null;
  difficulty: Difficulty;
  points: number;
  time_limit_seconds: number;
  order_index: number;
  image_url: string | null;
  created_at: string;
}

export interface AnswerOption {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  color: 'red' | 'blue' | 'yellow' | 'green';
  order_index: number;
}

/**
 * Question payload sent to players (without is_correct to prevent client-side inspection)
 */
export interface ClientAnswerOption {
  id: string;
  question_id: string;
  text: string;
  color: 'red' | 'blue' | 'yellow' | 'green';
  order_index: number;
}

export interface QuestionWithOptions extends Question {
  options: ClientAnswerOption[];
}

/**
 * Full question payload including correct answer for host / review phase
 */
export interface QuestionWithCorrectAnswer extends Question {
  options: AnswerOption[];
  correct_option_id: string;
}
