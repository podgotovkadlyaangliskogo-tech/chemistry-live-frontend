import { NextResponse } from 'next/server';
import { PlayerService } from '@/backend/services/player.service';
import { joinRoomSchema } from '@/shared/schemas/validation.schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = joinRoomSchema.safeParse(body);

    if (!validated.success) {
      const errorMsg = validated.error.issues.map((i) => i.message).join(', ');
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const { pin_code, nickname } = validated.data;
    const { session, player } = await PlayerService.joinRoom(pin_code, nickname);

    return NextResponse.json({
      success: true,
      data: {
        session,
        player,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка входа в комнату';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
