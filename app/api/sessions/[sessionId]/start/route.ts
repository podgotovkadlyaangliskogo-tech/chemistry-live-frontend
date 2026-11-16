import { NextResponse } from 'next/server';
import { GameService } from '@/backend/services/game.service';

interface Params {
  params: Promise<{ sessionId: string }>;
}

export async function POST(request: Request, segmentData: Params) {
  try {
    const { sessionId } = await segmentData.params;
    const session = await GameService.startGame(sessionId);

    return NextResponse.json({
      success: true,
      data: { session },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка старта игры';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
