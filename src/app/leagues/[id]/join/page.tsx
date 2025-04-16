'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { leagueAPI } from '@/services/api';
import { League } from '@prisma/client';

export default function JoinLeaguePage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const leagueId = params?.id as string;
  
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [league, setLeague] = useState<League | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      loadLeague();
    }
  }, [status, leagueId]);

  const loadLeague = async () => {
    try {
      const leagueData = await leagueAPI.getById(leagueId);
      setLeague(leagueData);
      
      // Check if user already has a team in this league
      const hasTeam = leagueData.teams.some((team: any) => team.userId === session?.user?.id);
      if (hasTeam) {
        // Redirect to league page if already has a team
        router.push(`/leagues/${leagueId}`);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load league details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await leagueAPI.join(leagueId, { teamName });
      router.push(`/leagues/${leagueId}`);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to join league');
      setLoading(false);
    }
  };

  if (!league) {
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
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Join {league.name}</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="teamName" className="form-label">
                Team Name
              </label>
              <input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                minLength={3}
                maxLength={30}
                className="form-input"
                placeholder="Enter your team name"
              />
              <p className="mt-1 text-sm text-gray-500">
                Choose a unique name for your team (3-30 characters)
              </p>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? 'Joining...' : 'Join League'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
