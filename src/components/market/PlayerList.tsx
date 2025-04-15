'use client';

import React, { useState } from 'react';
import { Player } from '@prisma/client';
import { PlayerCard } from './PlayerCard';

interface PlayerListProps {
  players: Player[];
  onPlayerSelect: (playerId: string) => void;
}

export function PlayerList({ players, onPlayerSelect }: PlayerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || player.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search players"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
        
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-input"
          >
            <option value="">All Roles</option>
            <option value="TOP">Top</option>
            <option value="JUNGLE">Jungle</option>
            <option value="MID">Mid</option>
            <option value="BOT">Bot</option>
            <option value="SUPPORT">Support</option>
          </select>
        </div>
      </div>
      
      {filteredPlayers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No players found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              actionLabel="Buy"
              onAction={() => onPlayerSelect(player.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
