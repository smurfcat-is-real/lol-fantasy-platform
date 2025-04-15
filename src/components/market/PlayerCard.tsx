'use client';

import React from 'react';
import { Player } from '@prisma/client';

interface PlayerCardProps {
  player: Player;
  actionLabel?: string;
  onAction?: () => void;
}

export function PlayerCard({ player, actionLabel, onAction }: PlayerCardProps) {
  // Role colors
  const roleColors: Record<string, string> = {
    'TOP': 'bg-red-100 text-red-800',
    'JUNGLE': 'bg-green-100 text-green-800',
    'MID': 'bg-blue-100 text-blue-800',
    'BOT': 'bg-purple-100 text-purple-800',
    'SUPPORT': 'bg-yellow-100 text-yellow-800'
  };
  
  const roleColor = roleColors[player.role] || 'bg-gray-100 text-gray-800';
  
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">{player.name}</h3>
            <p className="text-sm text-gray-500">{player.team}</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColor}`}>
            {player.role}
          </span>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-900">
            ${(player.price / 1000000).toFixed(2)}M
          </div>
          
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
