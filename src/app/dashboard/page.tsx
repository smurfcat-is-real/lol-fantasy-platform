'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { leagueAPI } from '@/services/api';
import { League } from '@prisma/client';
import Link from 'next/link';
import { useStore } from '@/store';

export default function DashboardPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const setCurrentLeague = useStore((state) => state.setCurrentLeague);
  const setCurrentTeam = useStore((state) => state.setCurrentTeam);
  
  useEffect(() => {
    loadLeagues();
  }, []);
  
  const loadLeagues = async () => {
    try {
      setLoading(true);
      const data = await leagueAPI.getAll();
      setLeagues(data);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load leagues');
    } finally {
      setLoading(false);
    }
  };
  
  // Clear any active league when returning to dashboard
  useEffect(() => {
    setCurrentLeague(null);
    setCurrentTeam(null);
  }, [setCurrentLeague, setCurrentTeam]);
  
  return (
    <MainLayout>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Leagues</h1>
        <Link
          href="/leagues/create"
          className="btn-primary"
        >
          Create League
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : leagues.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">You don't have any leagues yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map((league) => (
            <div key={league.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">{league.name}</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Teams: {league.maxTeams}</p>
                  <p>Max Players: {league.maxPlayers}</p>
                  <p>Budget: ${(league.budget / 1000000).toFixed(2)}M</p>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <Link 
                  href={`/leagues/${league.id}`}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  View League
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
