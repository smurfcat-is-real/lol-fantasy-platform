'use client';

import React, { useEffect, useState } from 'react';
import { Player } from '@prisma/client';
import { PlayerList } from './PlayerList';
import { useStore } from '@/store';
import { marketAPI } from '@/services/api';

export function TransferMarket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentTeam = useStore((state) => state.currentTeam);
  const availablePlayers = useStore((state) => state.availablePlayers);
  const setAvailablePlayers = useStore((state) => state.setAvailablePlayers);
  
  useEffect(() => {
    if (currentTeam) {
      loadAvailablePlayers();
    }
  }, [currentTeam]);
  
  const loadAvailablePlayers = async () => {
    if (!currentTeam) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const players = await marketAPI.getAvailablePlayers(currentTeam.id);
      setAvailablePlayers(players);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load available players');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBuyPlayer = async (playerId: string) => {
    if (!currentTeam) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await marketAPI.buyPlayer(currentTeam.id, playerId);
      
      if (result.success) {
        // Update current team (budget will have changed)
        // This would ideally be done by updating the store
        
        // Reload available players
        await loadAvailablePlayers();
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to buy player');
    } finally {
      setLoading(false);
    }
  };
  
  if (!currentTeam) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No team selected</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Transfer Market</h2>
          <div className="text-gray-500">
            Available Budget: ${(currentTeam.budget / 1000000).toFixed(2)}M
          </div>
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 text-red-700 p-3 rounded border border-red-200">
            {error}
          </div>
        )}
        
        <div className="mt-4">
          {loading ? (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading players...</p>
            </div>
          ) : (
            <PlayerList
              players={availablePlayers}
              onPlayerSelect={handleBuyPlayer}
            />
          )}
        </div>
      </div>
    </div>
  );
}
