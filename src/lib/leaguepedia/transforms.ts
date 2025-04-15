export interface RawPlayerData {
  ExternalId: string;
  Name: string;
  Role: string;
  Team: string;
  TotalKills?: number;
  TotalDeaths?: number;
  TotalAssists?: number;
  KDA?: number;
}

export interface RawMatchData {
  Player: string;
  Champion: string;
  Kills: number;
  Deaths: number;
  Assists: number;
  CS: number;
  Date: string;
  Winner: string;
}

export interface ProcessedPlayer {
  externalId: string;
  name: string;
  role: string;
  team: string;
  price: number;
}

export interface ProcessedMatchStat {
  playerExternalId: string;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  date: Date;
  victory: boolean;
}

export function transformPlayerData(raw: RawPlayerData): ProcessedPlayer {
  return {
    externalId: raw.ExternalId,
    name: raw.Name,
    role: raw.Role.toUpperCase(),
    team: raw.Team,
    price: calculateInitialPrice(raw)
  };
}

export function transformMatchData(raw: RawMatchData, playerExternalId: string): ProcessedMatchStat {
  return {
    playerExternalId,
    kills: Number(raw.Kills) || 0,
    deaths: Number(raw.Deaths) || 0,
    assists: Number(raw.Assists) || 0,
    cs: Number(raw.CS) || 0,
    date: new Date(raw.Date),
    victory: raw.Winner === raw.Player
  };
}

function calculateInitialPrice(player: RawPlayerData): number {
  // Base price calculation based on role and optional performance metrics
  const basePrice = 1000000; // 1 million base price
  
  // Role-based multipliers
  const roleMultipliers: Record<string, number> = {
    'TOP': 1,
    'JUNGLE': 1.05,
    'MID': 1.1,
    'BOT': 1.15,
    'SUPPORT': 0.9
  };
  
  // Team tier multipliers (simplified)
  const teamMultiplier = getTeamMultiplier(player.Team);
  
  // Performance multiplier if stats are available
  let performanceMultiplier = 1;
  if (player.KDA) {
    performanceMultiplier += Math.min(player.KDA / 5, 0.5); // Up to 50% boost for high KDA
  }
  
  const roleFactor = roleMultipliers[player.Role.toUpperCase()] || 1;
  
  return basePrice * roleFactor * teamMultiplier * performanceMultiplier;
}

function getTeamMultiplier(team: string): number {
  // This would ideally come from a database or configuration
  // Simplified version for top teams
  const topTeams = ['T1', 'G2 Esports', 'JD Gaming', 'Bilibili Gaming'];
  const highTierTeams = ['Gen.G', 'Fnatic', 'Team Liquid', 'Cloud9'];
  
  if (topTeams.includes(team)) return 1.3;
  if (highTierTeams.includes(team)) return 1.15;
  
  return 1;
}
