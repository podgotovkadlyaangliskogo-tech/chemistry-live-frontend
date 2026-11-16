import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnrlulybmpiutugxrkkj.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_bMckhKSjIWXA0NY3izdK9A_sf5tL0Jo';

  return createBrowserClient(url, anonKey);
}
