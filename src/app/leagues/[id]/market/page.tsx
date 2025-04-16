'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { TransferMarket } from '@/components/market/TransferMarket';
import { useStore } from '@/store';
import { leagueAPI } from '@/services/api';

export default function MarketPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const leagueId = params?.id as string;
  
  const currentLeague = useStore((state) => state.currentLeague);
  const currentTeam = useStore((state) => state.currentTeam);
  const setCurrentLeague = useStore((state) => state.setCurrentLeague);
  const setCurrentTeam = useStore((state) => state.setCurrentTeam);
  
  useEffect(() => {
    if (status === 'authenticated' && leagueId) {
      if (!currentLeague || currentLeague.id !== leagueId) {
        loadLeagueAndTeam();
      }
    }
  }, [status, leagueId, currentLeague]);
  
  const loadLeagueAndTeam = async () => {
    try {
      const league = await leagueAPI.getById(leagueId);
      setCurrentLeague(league);
      
      // Find the user's team in this league
      const userTeam = league.teams.find(team => team.userId === session?.user?.id);
      if (userTeam) {
        setCurrentTeam(userTeam);
      } else {
        router.push(`/leagues/${leagueId}/join`);
      }
    } catch (error) {
      console.error('Failed to load league:', error);
    }
  };
  
  if (status === 'loading') {
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
        <h1 className="text-2xl font-bold text-gray-900">Transfer Market</h1>
      </div>
      
      <TransferMarket />
    </MainLayout>
  );
}
