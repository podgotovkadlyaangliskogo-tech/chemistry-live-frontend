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

    // БАГ 5 фикс: проверяем блокировку комнаты
    if (session.is_locked) {
      throw new Error('Ведущий закрыл комнату. Новые игроки не могут присоединиться');
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

    const player = await PlayerRepository.getPlayerById(params.playerId);
    if (!player) {
      throw new Error('Игрок не найден');
    }

    const question = await QuizRepository.getQuestionWithCorrectAnswer(params.questionId);
    if (!question) {
      throw new Error('Вопрос не найден');
    }

    // 1. Идемпотентность: если игрок уже ответил на этот вопрос (повторный клик или ретрай)
    const alreadyAnswered = await PlayerRepository.hasPlayerAnswered(
      params.sessionId,
      params.playerId,
      params.questionId
    );
    if (alreadyAnswered) {
      const answers = await PlayerRepository.getAnswersByPlayer(params.sessionId, params.playerId);
      const existing = answers.find((a) => a.question_id === params.questionId);
      return {
        is_correct: existing?.is_correct ?? false,
        points_awarded: existing?.points_awarded ?? 0,
        new_score: player.score,
        new_streak: existing?.streak_at_answer ?? player.streak,
        correct_option_id: question.correct_option_id,
      };
    }

    // 2. Если раунд уже не активен (учитель уже переключил на разбор или следующий вопрос)
    if (session.status !== 'question_active' || session.current_question_id !== params.questionId) {
      return {
        is_correct: false,
        points_awarded: 0,
        new_score: player.score,
        new_streak: 0,
        correct_option_id: question.correct_option_id,
        closed: true,
      };
    }

    // 3. Проверка времени: если ответ задержался из-за сети или таймера, не ломаем игру 400-й ошибкой
    let safeResponseTime = Math.max(0, params.responseTimeMs);
    const isCorrect = question.correct_option_id === params.selectedOptionId;

    if (session.question_start_time) {
      const startTime = new Date(session.question_start_time).getTime();
      const elapsed = Date.now() - startTime;
      const timeLimitMs = question.time_limit_seconds * 1000 + 3000; // 3 сек grace period на сетевой лаг
      if (elapsed > timeLimitMs) {
        // Опоздавший ответ: засчитываем правильность, но без бонуса скорости
        safeResponseTime = question.time_limit_seconds * 1000;
      }
    }

    const { points, newStreak } = computeAnswerPoints(
      isCorrect,
      question.points,
      safeResponseTime,
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
      responseTimeMs: safeResponseTime,
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
