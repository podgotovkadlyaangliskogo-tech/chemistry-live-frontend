export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { PlayerService } from '@/backend/services/player.service';
import { submitAnswerSchema } from '@/shared/schemas/validation.schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = submitAnswerSchema.safeParse(body);

    if (!validated.success) {
      const errorMsg = validated.error.issues.map((i) => i.message).join(', ');
      console.warn('Answers validation warning:', errorMsg, body);
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const { session_id, player_id, question_id, selected_option_id, response_time_ms } =
      validated.data;

    const result = await PlayerService.submitAnswer({
      sessionId: session_id,
      playerId: player_id,
      questionId: question_id,
      selectedOptionId: selected_option_id,
      responseTimeMs: response_time_ms,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка обработки ответа';
    console.error('Answer submission error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
