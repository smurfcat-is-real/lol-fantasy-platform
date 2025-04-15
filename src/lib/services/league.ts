import { prisma } from '../prisma';
import type { League, Team } from '@prisma/client';

export class LeagueService {
  async createLeague(data: {
    name: string;
    ownerId: string;
    seasonId: string;
    maxTeams?: number;
    maxPlayers?: number;
    budget?: number;
  }): Promise<League> {
    return prisma.league.create({
      data: {
        ...data,
        maxTeams: data.maxTeams ?? 10,
        maxPlayers: data.maxPlayers ?? 8,
        budget: data.budget ?? 100000000
      }
    });
  }

  async getLeague(id: string): Promise<League | null> {
    return prisma.league.findUnique({
      where: { id },
      include: {
        teams: {
          include: {
            players: {
              include: {
                player: true
              }
            }
          }
        }
      }
    });
  }

  async getUserLeagues(userId: string): Promise<League[]> {
    return prisma.league.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { teams: { some: { userId } } }
        ]
      },
      include: {
        teams: {
          where: {
            userId
          }
        }
      }
    });
  }

  async joinLeague(userId: string, leagueId: string, teamName: string): Promise<Team> {
    const league = await prisma.league.findUnique({
      where: { id: leagueId },
      include: { teams: true }
    });

    if (!league) throw new Error('League not found');
    if (league.teams.length >= league.maxTeams) {
      throw new Error('League is full');
    }

    // Check if user already has a team in this league
    const existingTeam = league.teams.find(team => team.userId === userId);
    if (existingTeam) {
      throw new Error('You already have a team in this league');
    }

    return prisma.team.create({
      data: {
        name: teamName,
        userId,
        leagueId,
        budget: league.budget
      }
    });
  }

  async updateLeague(id: string, data: {
    name?: string;
    maxTeams?: number;
    maxPlayers?: number;
  }): Promise<League> {
    return prisma.league.update({
      where: { id },
      data
    });
  }

  async deleteLeague(id: string): Promise<League> {
    // This will cascade delete all teams and players on teams
    return prisma.league.delete({
      where: { id }
    });
  }

  async getLeagueStandings(leagueId: string): Promise<{ team: Team, position: number }[]> {
    const teams = await prisma.team.findMany({
      where: { leagueId },
      orderBy: { points: 'desc' }
    });

    return teams.map((team, index) => ({
      team,
      position: index + 1
    }));
  }

  async updateTeamPoints(teamId: string, points: number): Promise<Team> {
    return prisma.team.update({
      where: { id: teamId },
      data: { points }
    });
  }
}
