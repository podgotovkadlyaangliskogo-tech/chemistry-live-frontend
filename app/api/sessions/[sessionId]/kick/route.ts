import { NextResponse } from 'next/server';
import { RoomService } from '@/backend/services/room.service';

interface Params {
  params: Promise<{ sessionId: string }>;
}

export async function POST(request: Request, segmentData: Params) {
  try {
    const { sessionId } = await segmentData.params;
    const { playerId } = await request.json();

    if (!playerId) {
      return NextResponse.json({ success: false, error: 'playerId обязателен' }, { status: 400 });
    }

    const kicked = await RoomService.kickPlayer(sessionId, playerId);
    if (!kicked) {
      return NextResponse.json(
        { success: false, error: 'Не удалось удалить игрока' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { kicked: true, playerId },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка исключения игрока';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
