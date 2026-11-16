import { NextResponse } from 'next/server';
import { PlayerRepository } from '@/backend/repositories/player.repository';
import { GameRepository } from '@/backend/repositories/game.repository';

interface Params {
  params: Promise<{ sessionId: string }>;
}

export async function GET(request: Request, segmentData: Params) {
  try {
    const { sessionId } = await segmentData.params;
    const session = await GameRepository.getSessionById(sessionId);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Сессия не найдена' }, { status: 404 });
    }

    const leaderboard = await PlayerRepository.getLeaderboard(sessionId);
    const results = await GameRepository.getGameResults(sessionId);

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        status: session.status,
        leaderboard,
        results,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка загрузки лидеров';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
