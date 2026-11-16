export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { RoomService } from '@/backend/services/room.service';
import { GameRepository } from '@/backend/repositories/game.repository';

export async function POST(request: Request) {
  try {
    let quizId: string | undefined;
    let hostId: string | undefined;

    try {
      const body = await request.json();
      quizId = body.quiz_id;
      hostId = body.host_id;
    } catch {
      // Body is optional
    }

    const session = await RoomService.createSession(quizId, hostId);

    return NextResponse.json({
      success: true,
      data: { session },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка создания сессии';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessions = await GameRepository.getSessionsByHost();
    return NextResponse.json({ success: true, data: { sessions } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка загрузки сессий';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
