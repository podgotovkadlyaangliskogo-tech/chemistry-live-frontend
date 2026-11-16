import { headers } from 'next/headers';
import { createAdminClient } from '../lib/supabase.server';

export interface AuthenticatedTeacher {
  id: string;
  email?: string;
  role: string;
}

export async function verifyTeacherAuth(): Promise<AuthenticatedTeacher | null> {
  const headerList = await headers();
  const authHeader = headerList.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const supabase = createAdminClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: 'teacher',
  };
}
