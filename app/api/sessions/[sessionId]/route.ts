import { NextResponse } from 'next/server';
import { GameRepository } from '@/backend/repositories/game.repository';
import { QuizRepository } from '@/backend/repositories/quiz.repository';
import { PlayerRepository } from '@/backend/repositories/player.repository';

interface Params {
  params: Promise<{ sessionId: string }>;
}

export async function GET(request: Request, segmentData: Params) {
  try {
    const { sessionId } = await segmentData.params;
    const session = await GameRepository.getSessionById(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Сессия не найдена' },
        { status: 404 }
      );
    }

    const quiz = await QuizRepository.getQuizById(session.quiz_id);
    const questions = await QuizRepository.getQuestionsByQuizId(session.quiz_id);
    const players = await PlayerRepository.getPlayersBySession(sessionId);

    let activeQuestion = null;
    if (session.current_question_id) {
      // Используем getQuestionWithCorrectAnswer — teacher API, is_correct включён
      activeQuestion = await QuizRepository.getQuestionWithCorrectAnswer(session.current_question_id);
    }

    return NextResponse.json({
      success: true,
      data: {
        session,
        quiz,
        totalQuestions: questions.length,
        playersCount: players.length,
        activeQuestion,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка получения сессии';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
