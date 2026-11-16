import { NextResponse } from 'next/server';
import { createAdminClient } from '@/backend/lib/supabase.server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { success: false, error: error?.message || 'Неверный логин или пароль' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        token: data.session.access_token,
        user: data.user,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка аутентификации';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
