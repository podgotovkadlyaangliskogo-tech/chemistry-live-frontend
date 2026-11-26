import { NextResponse } from 'next/server';
import { QuizRepository } from '@/backend/repositories/quiz.repository';

interface Params {
  params: Promise<{ questionId: string }>;
}

/**
 * GET /api/questions/[questionId]          → студент (без is_correct)
 * GET /api/questions/[questionId]?t=1      → ведущий (с is_correct)
 *
 * Лёгкий эндпоинт: только 2 запроса в БД (questions + answer_options).
 * Используется при смене вопроса, чтобы не делать полный fetchSession.
 */
export async function GET(request: Request, segmentData: Params) {
  try {
    const { questionId } = await segmentData.params;
    const url = new URL(request.url);
    const isTeacher = url.searchParams.has('t');

    const question = isTeacher
      ? await QuizRepository.getQuestionWithCorrectAnswer(questionId)
      : await QuizRepository.getQuestionWithOptions(questionId);

    if (!question) {
      return NextResponse.json({ success: false, error: 'Вопрос не найден' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { question } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка получения вопроса';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
