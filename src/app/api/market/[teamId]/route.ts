import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { MarketService } from '@/lib/services/market';
import { prisma } from '@/lib/prisma';

const marketService = new MarketService();

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the team to verify ownership and get leagueId
    const team = await prisma.team.findUnique({
      where: { id: params.teamId },
      include: { league: true }
    });
    
    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }
    
    if (team.userId !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const availablePlayers = await marketService.getAvailablePlayers(team.leagueId);
    return NextResponse.json(availablePlayers);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { playerId } = await request.json();
    
    if (!playerId) {
      return NextResponse.json(
        { message: 'Player ID is required' },
        { status: 400 }
      );
    }
    
    // Verify team ownership
    const team = await prisma.team.findUnique({
      where: { id: params.teamId }
    });
    
    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }
    
    if (team.userId !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const result = await marketService.buyPlayer(params.teamId, playerId);
    
    if (result.success) {
      return NextResponse.json(result);
    }
    
    return NextResponse.json(result, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { playerId } = await request.json();
    
    if (!playerId) {
      return NextResponse.json(
        { message: 'Player ID is required' },
        { status: 400 }
      );
    }
    
    // Verify team ownership
    const team = await prisma.team.findUnique({
      where: { id: params.teamId }
    });
    
    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }
    
    if (team.userId !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const result = await marketService.sellPlayer(params.teamId, playerId);
    
    if (result.success) {
      return NextResponse.json(result);
    }
    
    return NextResponse.json(result, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
