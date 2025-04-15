'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { leagueAPI } from '@/services/api';

export function LeagueCreate() {
  const [name, setName] = useState('');
  const [seasonId, setSeasonId] = useState('Summer2023');
  const [maxTeams, setMaxTeams] = useState(10);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [budget, setBudget] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const league = await leagueAPI.create({
        name,
        seasonId,
        maxTeams,
        maxPlayers,
        budget: budget * 1000000 // Convert to game currency
      });
      
      router.push(`/leagues/${league.id}`);
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while creating the league');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900">Create New League</h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="form-label">
          League Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="form-input"
        />
      </div>
      
      <div>
        <label htmlFor="seasonId" className="form-label">
          Season
        </label>
        <select
          id="seasonId"
          value={seasonId}
          onChange={(e) => setSeasonId(e.target.value)}
          className="form-input"
        >
          <option value="Spring2023">Spring 2023</option>
          <option value="Summer2023">Summer 2023</option>
          <option value="Worlds2023">Worlds 2023</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="maxTeams" className="form-label">
            Max Teams
          </label>
          <input
            id="maxTeams"
            type="number"
            min="2"
            max="20"
            value={maxTeams}
            onChange={(e) => setMaxTeams(parseInt(e.target.value))}
            className="form-input"
          />
        </div>
        
        <div>
          <label htmlFor="maxPlayers" className="form-label">
            Max Players per Team
          </label>
          <input
            id="maxPlayers"
            type="number"
            min="5"
            max="15"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
            className="form-input"
          />
        </div>
        
        <div>
          <label htmlFor="budget" className="form-label">
            Starting Budget (millions)
          </label>
          <input
            id="budget"
            type="number"
            min="50"
            max="200"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
            className="form-input"
          />
        </div>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Creating...' : 'Create League'}
        </button>
      </div>
    </form>
  );
}
