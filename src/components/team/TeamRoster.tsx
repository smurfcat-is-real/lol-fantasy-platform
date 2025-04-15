'use client';

import React from 'react';
import { Player } from '@prisma/client';
import { PlayerCard } from '../market/PlayerCard';
import { useStore } from '@/store';

interface TeamRosterProps {
  players: Player[];
  onSellPlayer?: (playerId: string) => void;
}

export function TeamRoster({ players, onSellPlayer }: TeamRosterProps) {
  const currentTeam = useStore((state) => state.currentTeam);
  
  if (!currentTeam) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No team selected</p>
      </div>
    );
  }
  
  // Group players by role for organized display
  const roleOrder = ['TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT'];
  const playersByRole: Record<string, Player[]> = {};
  
  roleOrder.forEach(role => {
    playersByRole[role] = players.filter(player => player.role === role);
  });
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{currentTeam.name} Roster</h2>
          <div className="text-gray-500">
            Budget: ${(currentTeam.budget / 1000000).toFixed(2)}M
          </div>
        </div>
        
        <div className="mt-4">
          {players.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No players in your roster. Visit the transfer market to buy players.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {roleOrder.map(role => {
                const rolePlayers = playersByRole[role] || [];
                
                if (rolePlayers.length === 0) return null;
                
                return (
                  <div key={role}>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">{role}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rolePlayers.map((player) => (
                        <PlayerCard 
                          key={player.id} 
                          player={player} 
                          actionLabel={onSellPlayer ? "Sell" : undefined} 
                          onAction={onSellPlayer ? () => onSellPlayer(player.id) : undefined}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
