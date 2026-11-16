import { NextResponse } from 'next/server';
import { GameService } from '@/backend/services/game.service';

interface Params {
  params: Promise<{ sessionId: string; questionId: string }>;
}

export async function GET(request: Request, segmentData: Params) {
  try {
    const { sessionId, questionId } = await segmentData.params;
    const stats = await GameService.getQuestionStats(sessionId, questionId);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка загрузки статистики вопроса';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
