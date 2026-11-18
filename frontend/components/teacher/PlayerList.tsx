import React from 'react';
import { Player } from '@/shared/types/player.types';
import { UserX, Users } from 'lucide-react';

export interface PlayerListProps {
  players: Player[];
  onKickPlayer?: (playerId: string) => void;
  isLobby?: boolean;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  onKickPlayer,
  isLobby = true,
}) => {
  if (players.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02]">
        <Users className="w-12 h-12 mx-auto mb-4 text-slate-500" />
        <h3 className="text-base font-bold text-white mb-1">Ожидание игроков...</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Ученики могут ввести PIN-код на странице входа или отсканировать QR-код на экране
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Users className="w-4 h-4 text-[#4F8EF7]" />
          <span>Подключено участников ({players.length})</span>
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl hover:border-[#4F8EF7]/50 hover:bg-white/[0.07] transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative shrink-0 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39D98A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#39D98A]" />
              </span>
              <span className="text-sm font-bold text-white truncate">
                {player.nickname}
              </span>
            </div>

            {isLobby && onKickPlayer && (
              <button
                type="button"
                onClick={() => onKickPlayer(player.id)}
                title="Исключить игрока"
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all shrink-0 cursor-pointer"
              >
                <UserX className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
