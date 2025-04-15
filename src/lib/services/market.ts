import { prisma } from '../prisma';
import type { Player, Team } from '@prisma/client';

export class MarketService {
  async getAvailablePlayers(leagueId: string): Promise<Player[]> {
    // Get all players that are not in any team in this league
    const takenPlayerIds = await prisma.playerOnTeam.findMany({
      where: {
        team: {
          leagueId
        }
      },
      select: {
        playerId: true
      }
    });

    return prisma.player.findMany({
      where: {
        id: {
          notIn: takenPlayerIds.map(p => p.playerId)
        }
      },
      orderBy: {
        price: 'desc'
      }
    });
  }

  async buyPlayer(
    teamId: string,
    playerId: string
  ): Promise<{ success: boolean; message: string }> {
    const [team, player] = await Promise.all([
      prisma.team.findUnique({
        where: { id: teamId },
        include: { 
          players: true,
          league: true
        }
      }),
      prisma.player.findUnique({
        where: { id: playerId }
      })
    ]);

    if (!team || !player) {
      throw new Error('Team or player not found');
    }

    // Validate transaction
    if (team.budget < player.price) {
      return { success: false, message: 'Insufficient funds' };
    }

    if (team.players.length >= team.league.maxPlayers) {
      return { success: false, message: 'Team is full' };
    }

    // Check if player is already in another team in this league
    const existingPlayerOnTeam = await prisma.playerOnTeam.findFirst({
      where: {
        playerId,
        team: {
          leagueId: team.league.id
        }
      }
    });

    if (existingPlayerOnTeam) {
      return { success: false, message: 'Player is already on another team in this league' };
    }

    // Execute transaction
    await prisma.$transaction([
      prisma.playerOnTeam.create({
        data: {
          playerId,
          teamId
        }
      }),
      prisma.team.update({
        where: { id: teamId },
        data: {
          budget: {
            decrement: player.price
          }
        }
      })
    ]);

    return { success: true, message: 'Player purchased successfully' };
  }

  async sellPlayer(
    teamId: string,
    playerId: string
  ): Promise<{ success: boolean; message: string }> {
    const playerOnTeam = await prisma.playerOnTeam.findFirst({
      where: {
        teamId,
        playerId
      },
      include: {
        player: true
      }
    });

    if (!playerOnTeam) {
      return { success: false, message: 'Player not found in team' };
    }

    // Execute transaction
    await prisma.$transaction([
      prisma.playerOnTeam.delete({
        where: {
          id: playerOnTeam.id
        }
      }),
      prisma.team.update({
        where: { id: teamId },
        data: {
          budget: {
            increment: playerOnTeam.player.price
          }
        }
      })
    ]);

    return { success: true, message: 'Player sold successfully' };
  }

  async getTeamPlayers(teamId: string): Promise<Player[]> {
    const playersOnTeam = await prisma.playerOnTeam.findMany({
      where: { teamId },
      include: { player: true }
    });

    return playersOnTeam.map(pot => pot.player);
  }

  async searchPlayers(query: string, leagueId?: string): Promise<Player[]> {
    // Basic search functionality
    let players = await prisma.player.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { team: { contains: query, mode: 'insensitive' } },
          { role: { equals: query.toUpperCase() } }
        ]
      },
      orderBy: { price: 'desc' },
      take: 20
    });

    // If leagueId is provided, filter out players already in teams
    if (leagueId) {
      const takenPlayerIds = await prisma.playerOnTeam.findMany({
        where: {
          team: {
            leagueId
          }
        },
        select: {
          playerId: true
        }
      });

      players = players.filter(
        player => !takenPlayerIds.some(p => p.playerId === player.id)
      );
    }

    return players;
  }
}
