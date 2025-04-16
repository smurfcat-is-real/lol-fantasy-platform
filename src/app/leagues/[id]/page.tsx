'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { useStore } from '@/store';
import { leagueAPI } from '@/services/api';
import { League, Team } from '@prisma/client';
import Link from 'next/link';

interface LeagueWithTeams extends League {
  teams: Team[];
  owner: {
    name: string;
  };
}

export default function LeagueDetailsPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const leagueId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [league, setLeague] = useState<LeagueWithTeams | null>(null);
  
  const setCurrentLeague = useStore((state) => state.setCurrentLeague);
  const setCurrentTeam = useStore((state) => state.setCurrentTeam);
  
  useEffect(() => {
    if (status === 'authenticated' && leagueId) {
      loadLeague();
    }
  }, [status, leagueId]);
  
  const loadLeague = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const leagueData = await leagueAPI.getById(leagueId);
      setLeague(leagueData);
      setCurrentLeague(leagueData);
      
      // Find the user's team in this league
      const userTeam = leagueData.teams.find((team: Team) => team.userId === session?.user?.id);
      if (userTeam) {
        setCurrentTeam(userTeam);
      } else {
        setCurrentTeam(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load league details');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Back to Dashboard
        </button>
      </MainLayout>
    );
  }
  
  if (!league) {
    return (
      <MainLayout>
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg mb-6">
          League not found
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Back to Dashboard
        </button>
      </MainLayout>
    );
  }
  
  const hasTeam = league.teams.some(team => team.userId === session?.user?.id);
  
  return (
    <MainLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{league.name}</h1>
          <p className="text-gray-600">
            Created by {league.owner?.name || 'Unknown'}
          </p>
        </div>
        {!hasTeam && (
          <Link
            href={`/leagues/${league.id}/join`}
            className="btn-primary"
          >
            Join League
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">League Info</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Season:</span>
              <span className="text-gray-900">{league.seasonId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Teams:</span>
              <span className="text-gray-900">{league.teams.length} / {league.maxTeams}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Players per Team:</span>
              <span className="text-gray-900">{league.maxPlayers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Budget:</span>
              <span className="text-gray-900">${(league.budget / 1000000).toFixed(2)}M</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Teams</h2>
          {league.teams.length === 0 ? (
            <p className="text-gray-500">No teams have joined this league yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {league.teams.map((team) => (
                <li key={team.id} className="py-3 flex justify-between items-center">
                  <span className="font-medium">{team.name}</span>
                  <span className="text-gray-500">{team.points} pts</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
