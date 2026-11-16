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
      <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/50">
        <Users className="w-10 h-10 text-stone-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-stone-700">Ожидание игроков...</h3>
        <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
          Ученики могут ввести PIN-код на странице входа или отсканировать QR-код на экране
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
          <Users className="w-4 h-4 text-stone-600" />
          <span>Подключено участников ({players.length})</span>
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200/90 shadow-sm hover:shadow transition-all group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-sm font-bold text-stone-800 truncate">
                {player.nickname}
              </span>
            </div>

            {isLobby && onKickPlayer && (
              <button
                type="button"
                onClick={() => onKickPlayer(player.id)}
                title="Исключить игрока"
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
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
