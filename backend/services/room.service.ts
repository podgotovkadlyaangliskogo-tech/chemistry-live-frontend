import { GameRepository } from '../repositories/game.repository';
import { QuizRepository } from '../repositories/quiz.repository';
import { PlayerRepository } from '../repositories/player.repository';
import { GameSession } from '@/shared/types/game.types';

export class RoomService {
  /**
   * Generates a 6-digit numeric PIN and verifies uniqueness against active sessions
   */
  static async generateUniquePin(): Promise<string> {
    for (let attempts = 0; attempts < 10; attempts++) {
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const existing = await GameRepository.getSessionByPin(pin);
      if (!existing || existing.status === 'game_over' || existing.status === 'cancelled') {
        return pin;
      }
    }
    // Fallback if 10 collisions occurred
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async createSession(quizId?: string, hostId?: string | null): Promise<GameSession> {
    let targetQuizId = quizId;

    if (!targetQuizId) {
      try {
        const defaultQuiz = await QuizRepository.getDefaultQuiz();
        targetQuizId = defaultQuiz?.id || 'a0000000-0000-0000-0000-000000000001';
      } catch {
        targetQuizId = 'a0000000-0000-0000-0000-000000000001';
      }
    }

    const pin = await this.generateUniquePin();
    return GameRepository.createSession(targetQuizId, pin, hostId);
  }

  static async kickPlayer(sessionId: string, playerId: string): Promise<boolean> {
    const player = await PlayerRepository.getPlayerById(playerId);
    if (!player || player.session_id !== sessionId) {
      return false;
    }
    return PlayerRepository.deletePlayer(playerId);
  }
}
