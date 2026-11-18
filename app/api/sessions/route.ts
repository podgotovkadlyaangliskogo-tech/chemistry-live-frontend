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
      quizId = body?.quiz_id ? String(body.quiz_id).trim() : undefined;
      hostId = body?.host_id ? String(body.host_id).trim() : undefined;
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

export async function GET(request: Request) {
  try {
    // BUG 4 fix: filter sessions by authenticated host so we don't expose all sessions
    let hostId: string | undefined;
    try {
      const { createServerClient } = await import('@supabase/ssr');
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll() { /* read-only in route handler */ },
          },
        }
      );
      const { data: { user } } = await supabase.auth.getUser();
      hostId = user?.id;
    } catch {
      // If auth resolution fails, fall through without filtering (TODO: enforce auth)
    }

    const sessions = await GameRepository.getSessionsByHost(hostId);
    return NextResponse.json({ success: true, data: { sessions } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка загрузки сессий';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
