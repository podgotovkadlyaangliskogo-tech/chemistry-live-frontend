import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (typeof window !== 'undefined' && browserClient) {
    return browserClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnrlulybmpiutugxrkkj.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_bMckhKSjIWXA0NY3izdK9A_sf5tL0Jo';

  const client = createBrowserClient(url, anonKey);

  if (typeof window !== 'undefined') {
    browserClient = client;
  }

  return client;
}
