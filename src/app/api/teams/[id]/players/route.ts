import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { MarketService } from '@/lib/services/market';
import { prisma } from '@/lib/prisma';

const marketService = new MarketService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the team to verify access rights
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: { 
        league: {
          include: {
            teams: {
              select: {
                userId: true
              }
            }
          }
        } 
      }
    });
    
    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }
    
    // Check if user is the team owner or a member of the league
    const isTeamOwner = team.userId === session.user.id;
    const isLeagueMember = team.league.teams.some(t => t.userId === session.user.id);
    
    if (!isTeamOwner && !isLeagueMember) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const players = await marketService.getTeamPlayers(params.id);
    return NextResponse.json(players);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
