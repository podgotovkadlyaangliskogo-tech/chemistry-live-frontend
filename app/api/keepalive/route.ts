import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, any> = {};

  // 1. Ping chemistry-live Supabase (active project)
  try {
    const chemRes = await fetch(
      'https://pnrlulybmpiutugxrkkj.supabase.co/rest/v1/game_sessions?select=id&limit=1',
      {
        headers: {
          apikey: 'sb_publishable_bMckhKSjIWXA0NY3izdK9A_sf5tL0Jo',
          Authorization: 'Bearer sb_publishable_bMckhKSjIWXA0NY3izdK9A_sf5tL0Jo',
        },
        cache: 'no-store',
      }
    );
    results['chemistry-live'] = { status: chemRes.status, ok: chemRes.ok };
  } catch (err: any) {
    results['chemistry-live'] = { error: err.message };
  }

  // 2. Ping EndlessX Supabase (Aral project)
  try {
    const endlessRes = await fetch(
      'https://ythdfltgdvfjllgyutnz.supabase.co/rest/v1/',
      { cache: 'no-store' }
    );
    results['EndlessX'] = { status: endlessRes.status, ok: endlessRes.ok };
  } catch (err: any) {
    results['EndlessX'] = { error: err.message };
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    results,
  });
}
