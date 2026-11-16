import { NextResponse } from 'next/server';
import { PlayerRepository } from '@/backend/repositories/player.repository';

interface Params {
  params: Promise<{ playerId: string }>;
}

export async function GET(request: Request, segmentData: Params) {
  try {
    const { playerId } = await segmentData.params;
    const player = await PlayerRepository.getPlayerById(playerId);

    if (!player) {
      return NextResponse.json({ success: false, error: 'Игрок не найден' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { player },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка загрузки игрока';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
