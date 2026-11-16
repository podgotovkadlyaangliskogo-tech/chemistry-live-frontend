import { createAdminClient } from '../lib/supabase.server';
import { GameSession, GameStatus, GameResult } from '@/shared/types/game.types';

export class GameRepository {
  private static client = createAdminClient();

  static async createSession(
    quizId: string,
    pinCode: string,
    hostId?: string | null
  ): Promise<GameSession> {
    const { data, error } = await this.client
      .from('game_sessions')
      .insert({
        quiz_id: quizId,
        pin_code: pinCode,
        host_id: hostId || null,
        status: 'lobby',
        current_question_index: 0,
      })
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Не удалось создать сессию');
    }

    return data as GameSession;
  }

  static async getSessionById(sessionId: string): Promise<GameSession | null> {
    const { data, error } = await this.client
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !data) return null;
    return data as GameSession;
  }

  static async getSessionByPin(pinCode: string): Promise<GameSession | null> {
    const { data, error } = await this.client
      .from('game_sessions')
      .select('*')
      .eq('pin_code', pinCode)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return data as GameSession;
  }

  static async updateSession(
    sessionId: string,
    updates: Partial<GameSession>
  ): Promise<GameSession | null> {
    const { data, error } = await this.client
      .from('game_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select('*')
      .single();

    if (error || !data) return null;
    return data as GameSession;
  }

  static async getSessionsByHost(hostId?: string | null): Promise<GameSession[]> {
    let query = this.client
      .from('game_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (hostId) {
      query = query.eq('host_id', hostId);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as GameSession[];
  }

  static async saveResults(results: Omit<GameResult, 'id' | 'created_at'>[]): Promise<void> {
    if (results.length === 0) return;
    await this.client.from('game_results').upsert(results, { onConflict: 'session_id,player_id' });
  }

  static async getGameResults(sessionId: string): Promise<GameResult[]> {
    const { data, error } = await this.client
      .from('game_results')
      .select('*')
      .eq('session_id', sessionId)
      .order('final_rank', { ascending: true });

    if (error || !data) return [];
    return data as GameResult[];
  }
}
