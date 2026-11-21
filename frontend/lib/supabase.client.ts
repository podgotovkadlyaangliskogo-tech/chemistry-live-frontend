import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (typeof window !== 'undefined' && browserClient) {
    return browserClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY должны быть заданы в .env.local'
    );
  }

  const client = createBrowserClient(url, anonKey);

  if (typeof window !== 'undefined') {
    browserClient = client;
  }

  return client;
}
