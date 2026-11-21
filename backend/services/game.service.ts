import { GameRepository } from '../repositories/game.repository';
import { QuizRepository } from '../repositories/quiz.repository';
import { PlayerRepository } from '../repositories/player.repository';
import { GameSession } from '@/shared/types/game.types';

export class GameService {
  static async startGame(sessionId: string): Promise<GameSession> {
    const session = await GameRepository.getSessionById(sessionId);
    if (!session) {
      throw new Error('Сессия не найдена');
    }

    const questions = await QuizRepository.getQuestionsByQuizId(session.quiz_id);
    if (questions.length === 0) {
      throw new Error('В выбранном квизе нет вопросов');
    }

    const firstQuestion = questions[0];
    const updated = await GameRepository.updateSession(sessionId, {
      status: 'question_active',
      current_question_index: 0,
      current_question_id: firstQuestion.id,
      question_start_time: new Date().toISOString(),
    });

    if (!updated) {
      throw new Error('Не удалось обновить статус сессии');
    }

    return updated;
  }

  static async revealAnswer(sessionId: string): Promise<GameSession> {
    const session = await GameRepository.getSessionById(sessionId);
    if (!session) {
      throw new Error('Сессия не найдена');
    }

    const updated = await GameRepository.updateSession(sessionId, {
      status: 'question_review',
    });

    if (!updated) {
      throw new Error('Не удалось показать ответы');
    }

    return updated;
  }

  static async showLeaderboard(sessionId: string): Promise<GameSession> {
    const session = await GameRepository.getSessionById(sessionId);
    if (!session) {
      throw new Error('Сессия не найдена');
    }

    const updated = await GameRepository.updateSession(sessionId, {
      status: 'leaderboard',
    });

    if (!updated) {
      throw new Error('Не удалось переключить на таблицу лидеров');
    }

    return updated;
  }

  static async advanceToNextQuestion(sessionId: string): Promise<GameSession> {
    const session = await GameRepository.getSessionById(sessionId);
    if (!session) {
      throw new Error('Сессия не найдена');
    }

    const questions = await QuizRepository.getQuestionsByQuizId(session.quiz_id);
    const nextIndex = session.current_question_index + 1;

    if (nextIndex >= questions.length) {
      return this.endGame(sessionId);
    }

    const nextQuestion = questions[nextIndex];
    const updated = await GameRepository.updateSession(sessionId, {
      status: 'question_active',
      current_question_index: nextIndex,
      current_question_id: nextQuestion.id,
      question_start_time: new Date().toISOString(),
    });

    if (!updated) {
      throw new Error('Не удалось перейти к следующему вопросу');
    }

    return updated;
  }

  static async endGame(sessionId: string): Promise<GameSession> {
    const session = await GameRepository.getSessionById(sessionId);
    if (!session) {
      throw new Error('Сессия не найдена');
    }

    const questions = await QuizRepository.getQuestionsByQuizId(session.quiz_id);
    const totalQuestions = questions.length;

    const players = await PlayerRepository.getPlayersBySession(sessionId);

    // BUG 2 fix: use getAnswersByPlayer (by playerId) instead of getAnswersForQuestion (by questionId)
    // BUG 3 fix: sort by final_score descending BEFORE assigning ranks
    const unsortedResults = await Promise.all(
      players.map(async (player) => {
        const answers = await PlayerRepository.getAnswersByPlayer(sessionId, player.id);
        const correctCount = answers.filter((a) => a.is_correct).length;

        return {
          session_id: sessionId,
          player_id: player.id,
          final_score: player.score,
          correct_answers_count: correctCount,
          total_questions: totalQuestions,
        };
      })
    );

    // Sort by final_score descending so ranks are correct
    unsortedResults.sort((a, b) => b.final_score - a.final_score);

    const results = unsortedResults.map((r, index) => ({
      ...r,
      final_rank: index + 1,
    }));

    await GameRepository.saveResults(results);

    const updated = await GameRepository.updateSession(sessionId, {
      status: 'game_over',
    });

    if (!updated) {
      throw new Error('Не удалось завершить сессию');
    }

    return updated;
  }

  static async getQuestionStats(sessionId: string, questionId: string) {
    const session = await GameRepository.getSessionById(sessionId);
    const answers = await PlayerRepository.getAnswersForQuestion(sessionId, questionId);
    const question = await QuizRepository.getQuestionWithCorrectAnswer(questionId);
    if (!question) return { counts: {}, totalAnswers: 0, correctOptionId: null };

    const counts: Record<string, number> = {};
    for (const opt of question.options) {
      counts[opt.id] = 0;
    }

    for (const ans of answers) {
      if (ans.selected_option_id && counts[ans.selected_option_id] !== undefined) {
        counts[ans.selected_option_id]++;
      }
    }

    // Защита от читерства: пока раунд активен, правильный ответ скрыт
    const isRevealedPhase = session && ['question_review', 'leaderboard', 'game_over'].includes(session.status);

    return {
      counts,
      totalAnswers: answers.length,
      correctOptionId: isRevealedPhase ? question.correct_option_id : null,
    };
  }
}
