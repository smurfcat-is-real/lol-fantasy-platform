import axios from 'axios';
import { League, Player, Team } from '@prisma/client';

const api = axios.create({
  baseURL: '/api'
});

export interface CreateLeagueDTO {
  name: string;
  seasonId: string;
  maxTeams?: number;
  maxPlayers?: number;
  budget?: number;
}

export interface JoinLeagueDTO {
  teamName: string;
}

export const leagueAPI = {
  create: async (data: CreateLeagueDTO): Promise<League> => {
    const response = await api.post('/leagues', data);
    return response.data;
  },
  
  getAll: async (): Promise<League[]> => {
    const response = await api.get('/leagues');
    return response.data;
  },
  
  getById: async (id: string): Promise<League> => {
    const response = await api.get(`/leagues/${id}`);
    return response.data;
  },
  
  join: async (leagueId: string, data: JoinLeagueDTO): Promise<Team> => {
    const response = await api.post(`/leagues/${leagueId}/join`, data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<League>): Promise<League> => {
    const response = await api.put(`/leagues/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<League> => {
    const response = await api.delete(`/leagues/${id}`);
    return response.data;
  }
};

export const marketAPI = {
  getAvailablePlayers: async (teamId: string): Promise<Player[]> => {
    const response = await api.get(`/market/${teamId}`);
    return response.data;
  },
  
  buyPlayer: async (teamId: string, playerId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/market/${teamId}`, { playerId });
    return response.data;
  },
  
  sellPlayer: async (teamId: string, playerId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/market/${teamId}`, {
      data: { playerId }
    });
    return response.data;
  }
};

export const teamAPI = {
  getTeamPlayers: async (teamId: string): Promise<Player[]> => {
    const response = await api.get(`/teams/${teamId}/players`);
    return response.data;
  },
  
  updateTeam: async (teamId: string, data: Partial<Team>): Promise<Team> => {
    const response = await api.put(`/teams/${teamId}`, data);
    return response.data;
  }
};
