import { NextResponse } from 'next/server';
import { GameService } from '@/backend/services/game.service';

interface Params {
  params: Promise<{ sessionId: string }>;
}

export async function POST(request: Request, segmentData: Params) {
  try {
    const { sessionId } = await segmentData.params;
    let action = 'next';

    try {
      const body = await request.json();
      if (body.action) {
        action = body.action;
      }
    } catch {
      // Body is optional
    }

    let session;
    if (action === 'reveal') {
      session = await GameService.revealAnswer(sessionId);
    } else if (action === 'leaderboard') {
      session = await GameService.showLeaderboard(sessionId);
    } else {
      session = await GameService.advanceToNextQuestion(sessionId);
    }

    return NextResponse.json({
      success: true,
      data: { session },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка переключения вопроса';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
