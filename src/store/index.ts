import { create } from 'zustand';
import { League, Player, Team } from '@prisma/client';

interface StoreState {
  currentLeague: League | null;
  currentTeam: Team | null;
  availablePlayers: Player[];
  teamPlayers: Player[];
  loading: boolean;
  setCurrentLeague: (league: League | null) => void;
  setCurrentTeam: (team: Team | null) => void;
  setAvailablePlayers: (players: Player[]) => void;
  setTeamPlayers: (players: Player[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  currentLeague: null,
  currentTeam: null,
  availablePlayers: [],
  teamPlayers: [],
  loading: false,
  setCurrentLeague: (league) => set({ currentLeague: league }),
  setCurrentTeam: (team) => set({ currentTeam: team }),
  setAvailablePlayers: (players) => set({ availablePlayers: players }),
  setTeamPlayers: (players) => set({ teamPlayers: players }),
  setLoading: (loading) => set({ loading })
}));
