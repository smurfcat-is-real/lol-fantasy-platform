'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { TeamRoster } from '@/components/team/TeamRoster';
import { useStore } from '@/store';
import { leagueAPI, marketAPI, teamAPI } from '@/services/api';
import { Player } from '@prisma/client';
import Link from 'next/link';

export default function TeamPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const leagueId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
  
  const currentLeague = useStore((state) => state.currentLeague);
  const currentTeam = useStore((state) => state.currentTeam);
  const setCurrentLeague = useStore((state) => state.setCurrentLeague);
  const setCurrentTeam = useStore((state) => state.setCurrentTeam);
  
  useEffect(() => {
    if (status === 'authenticated' && leagueId) {
      if (!currentLeague || currentLeague.id !== leagueId) {
        loadLeagueAndTeam();
      } else if (currentTeam) {
        loadTeamPlayers();
      }
    }
  }, [status, leagueId, currentLeague, currentTeam]);
  
  const loadLeagueAndTeam = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const league = await leagueAPI.getById(leagueId);
      setCurrentLeague(league);
      
      // Find the user's team in this league
      const userTeam = league.teams.find(team => team.userId === session?.user?.id);
      if (userTeam) {
        setCurrentTeam(userTeam);
        loadTeamPlayers();
      } else {
        router.push(`/leagues/${leagueId}/join`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load league details');
      setLoading(false);
    }
  };
  
  const loadTeamPlayers = async () => {
    if (!currentTeam) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const players = await teamAPI.getTeamPlayers(currentTeam.id);
      setTeamPlayers(players);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load team players');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSellPlayer = async (playerId: string) => {
    if (!currentTeam) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await marketAPI.sellPlayer(currentTeam.id, playerId);
      
      if (result.success) {
        // Reload team data to reflect changes
        await loadLeagueAndTeam();
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sell player');
    } finally {
      setLoading(false);
    }
  };
  
  if (status === 'loading' || loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Team</h1>
        
        <Link
          href={`/leagues/${leagueId}/market`}
          className="btn-primary"
        >
          Transfer Market
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <TeamRoster 
        players={teamPlayers}
        onSellPlayer={handleSellPlayer}
      />
    </MainLayout>
  );
}
