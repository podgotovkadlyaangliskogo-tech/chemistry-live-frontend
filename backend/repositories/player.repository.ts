import { createAdminClient } from '../lib/supabase.server';
import { Player, PlayerAnswer, LeaderboardEntry } from '@/shared/types/player.types';

export class PlayerRepository {
  private static client = createAdminClient();

  static async createPlayer(sessionId: string, nickname: string): Promise<Player> {
    const { data, error } = await this.client
      .from('players')
      .insert({
        session_id: sessionId,
        nickname: nickname.trim(),
        score: 0,
        streak: 0,
        is_connected: true,
      })
      .select('*')
      .single();

    if (error || !data) {
      if (error?.code === '23505') {
        throw new Error('Игрок с таким никнеймом уже есть в комнате');
      }
      throw new Error(error?.message || 'Не удалось создать игрока');
    }

    return data as Player;
  }

  static async getPlayerById(playerId: string): Promise<Player | null> {
    const { data, error } = await this.client
      .from('players')
      .select('*')
      .eq('id', playerId)
      .single();

    if (error || !data) return null;
    return data as Player;
  }

  static async getPlayersBySession(sessionId: string): Promise<Player[]> {
    const { data, error } = await this.client
      .from('players')
      .select('*')
      .eq('session_id', sessionId)
      .order('score', { ascending: false });

    if (error || !data) return [];
    return data as Player[];
  }

  static async deletePlayer(playerId: string): Promise<boolean> {
    const { error } = await this.client
      .from('players')
      .delete()
      .eq('id', playerId);

    return !error;
  }

  static async updatePlayerScore(
    playerId: string,
    pointsAwarded: number,
    newStreak: number
  ): Promise<Player | null> {
    const player = await this.getPlayerById(playerId);
    if (!player) return null;

    const newScore = player.score + pointsAwarded;

    const { data, error } = await this.client
      .from('players')
      .update({
        score: newScore,
        streak: newStreak,
        last_active_at: new Date().toISOString(),
      })
      .eq('id', playerId)
      .select('*')
      .single();

    if (error || !data) return null;
    return data as Player;
  }

  static async saveAnswer(params: {
    sessionId: string;
    playerId: string;
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
    responseTimeMs: number;
    pointsAwarded: number;
    streakAtAnswer: number;
  }): Promise<PlayerAnswer> {
    const { data, error } = await this.client
      .from('player_answers')
      .insert({
        session_id: params.sessionId,
        player_id: params.playerId,
        question_id: params.questionId,
        selected_option_id: params.selectedOptionId,
        is_correct: params.isCorrect,
        response_time_ms: params.responseTimeMs,
        points_awarded: params.pointsAwarded,
        streak_at_answer: params.streakAtAnswer,
      })
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Не удалось сохранить ответ');
    }

    return data as PlayerAnswer;
  }

  static async hasPlayerAnswered(sessionId: string, playerId: string, questionId: string): Promise<boolean> {
    const { count, error } = await this.client
      .from('player_answers')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .eq('player_id', playerId)
      .eq('question_id', questionId);

    if (error) return false;
    return (count || 0) > 0;
  }

  static async getAnswersForQuestion(sessionId: string, questionId: string): Promise<PlayerAnswer[]> {
    const { data, error } = await this.client
      .from('player_answers')
      .select('*')
      .eq('session_id', sessionId)
      .eq('question_id', questionId);

    if (error || !data) return [];
    return data as PlayerAnswer[];
  }

  static async getLeaderboard(sessionId: string): Promise<LeaderboardEntry[]> {
    const players = await this.getPlayersBySession(sessionId);

    return players.map((player, index) => ({
      rank: index + 1,
      playerId: player.id,
      nickname: player.nickname,
      score: player.score,
      streak: player.streak,
    }));
  }
}
