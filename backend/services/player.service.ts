import { GameRepository } from '../repositories/game.repository';
import { PlayerRepository } from '../repositories/player.repository';
import { QuizRepository } from '../repositories/quiz.repository';
import { computeAnswerPoints } from './scoring.service';
import { Player } from '@/shared/types/player.types';
import { GameSession } from '@/shared/types/game.types';

export class PlayerService {
  static async joinRoom(
    pinCode: string,
    nickname: string
  ): Promise<{ session: GameSession; player: Player }> {
    const session = await GameRepository.getSessionByPin(pinCode);
    if (!session) {
      throw new Error('Комната с таким PIN-кодом не найдена');
    }

    if (session.status !== 'lobby') {
      throw new Error('Игра уже началась или завершена. Вход невозможен');
    }

    const player = await PlayerRepository.createPlayer(session.id, nickname);

    return { session, player };
  }

  static async submitAnswer(params: {
    sessionId: string;
    playerId: string;
    questionId: string;
    selectedOptionId: string;
    responseTimeMs: number;
  }) {
    const session = await GameRepository.getSessionById(params.sessionId);
    if (!session) {
      throw new Error('Сессия не найдена');
    }

    if (session.status !== 'question_active') {
      throw new Error('Прием ответов на данный вопрос закрыт');
    }

    if (session.current_question_id !== params.questionId) {
      throw new Error('Ответ отправлен не на текущий активный вопрос');
    }

    const alreadyAnswered = await PlayerRepository.hasPlayerAnswered(
      params.sessionId,
      params.playerId,
      params.questionId
    );
    if (alreadyAnswered) {
      throw new Error('Вы уже ответили на этот вопрос');
    }

    const player = await PlayerRepository.getPlayerById(params.playerId);
    if (!player) {
      throw new Error('Игрок не найден');
    }

    const question = await QuizRepository.getQuestionWithCorrectAnswer(params.questionId);
    if (!question) {
      throw new Error('Вопрос не найден');
    }

    // BUG 7 fix: reject answers submitted after the time limit (+ 2 s grace period)
    if (session.question_start_time) {
      const startTime = new Date(session.question_start_time).getTime();
      const elapsed = Date.now() - startTime;
      const timeLimitMs = question.time_limit_seconds * 1000 + 2000; // 2 s grace period
      if (elapsed > timeLimitMs) {
        throw new Error('Время для ответа истекло');
      }
    }

    const isCorrect = question.correct_option_id === params.selectedOptionId;

    const { points, newStreak } = computeAnswerPoints(
      isCorrect,
      question.points,
      params.responseTimeMs,
      question.time_limit_seconds,
      player.streak
    );

    const updatedPlayer = await PlayerRepository.updatePlayerScore(
      params.playerId,
      points,
      newStreak
    );

    await PlayerRepository.saveAnswer({
      sessionId: params.sessionId,
      playerId: params.playerId,
      questionId: params.questionId,
      selectedOptionId: params.selectedOptionId,
      isCorrect,
      responseTimeMs: params.responseTimeMs,
      pointsAwarded: points,
      streakAtAnswer: newStreak,
    });

    return {
      is_correct: isCorrect,
      points_awarded: points,
      new_score: updatedPlayer ? updatedPlayer.score : player.score + points,
      new_streak: newStreak,
      correct_option_id: question.correct_option_id,
    };
  }
}
