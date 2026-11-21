import { NextResponse } from 'next/server';
import { GameRepository } from '@/backend/repositories/game.repository';

interface Params {
  params: Promise<{ sessionId: string }>;
}

export async function POST(request: Request, segmentData: Params) {
  try {
    const { sessionId } = await segmentData.params;
    const body = await request.json().catch(() => ({}));
    const locked = body.locked !== undefined ? Boolean(body.locked) : true;

    const session = await GameRepository.getSessionById(sessionId);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Сессия не найдена' }, { status: 404 });
    }

    // БАГ 5 фикс: реально сохраняем is_locked в базу данных
    const updated = await GameRepository.updateSession(sessionId, { is_locked: locked });
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Не удалось обновить статус комнаты' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: { sessionId, isLocked: locked },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка блокировки комнаты';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
