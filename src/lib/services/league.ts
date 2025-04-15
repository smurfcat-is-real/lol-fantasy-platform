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
    const league = await prisma.league.create({
      data: {
        ...data,
        maxTeams: data.maxTeams ?? 10,
        maxPlayers: data.maxPlayers ?? 8,
        budget: data.budget ?? 100000000
      }
    });
    
    // Automatically create a team for the league owner
    await this.createTeam({
      name: `${data.name} Owner's Team`,
      userId: data.ownerId,
      leagueId: league.id,
      budget: league.budget
    });
    
    return league;
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
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true
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
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async createTeam(data: {
    name: string;
    userId: string;
    leagueId: string;
    budget: number;
  }): Promise<Team> {
    const league = await prisma.league.findUnique({
      where: { id: data.leagueId },
      include: { teams: true }
    });

    if (!league) {
      throw new Error('League not found');
    }

    if (league.teams.length >= league.maxTeams) {
      throw new Error('League is full');
    }

    // Check if user already has a team in this league
    const existingTeam = await prisma.team.findFirst({
      where: {
        leagueId: data.leagueId,
        userId: data.userId
      }
    });

    if (existingTeam) {
      throw new Error('You already have a team in this league');
    }

    return prisma.team.create({
      data
    });
  }

  async joinLeague(userId: string, leagueId: string, teamName: string): Promise<Team> {
    const league = await prisma.league.findUnique({
      where: { id: leagueId },
      include: { teams: true }
    });

    if (!league) {
      throw new Error('League not found');
    }

    return this.createTeam({
      name: teamName,
      userId,
      leagueId,
      budget: league.budget
    });
  }

  async updateLeague(id: string, data: {
    name?: string;
    maxTeams?: number;
    maxPlayers?: number;
    budget?: number;
  }): Promise<League> {
    return prisma.league.update({
      where: { id },
      data
    });
  }

  async deleteLeague(id: string): Promise<League> {
    // First delete all teams and their player associations
    const teams = await prisma.team.findMany({
      where: { leagueId: id },
      include: { players: true }
    });

    for (const team of teams) {
      // Delete player associations
      await prisma.playerOnTeam.deleteMany({
        where: { teamId: team.id }
      });
    }

    // Delete all teams
    await prisma.team.deleteMany({
      where: { leagueId: id }
    });

    // Delete the league
    return prisma.league.delete({
      where: { id }
    });
  }

  async getLeagueStandings(leagueId: string): Promise<any[]> {
    const teams = await prisma.team.findMany({
      where: { leagueId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        players: {
          include: {
            player: true
          }
        }
      },
      orderBy: {
        points: 'desc'
      }
    });

    return teams.map((team, index) => ({
      position: index + 1,
      id: team.id,
      name: team.name,
      owner: team.user.name || team.user.email,
      points: team.points,
      playerCount: team.players.length,
      budget: team.budget
    }));
  }
}
