import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { LeagueService } from '@/lib/services/league';
import { prisma } from '@/lib/prisma';

const leagueService = new LeagueService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const league = await leagueService.getLeague(params.id);
    
    if (!league) {
      return NextResponse.json({ message: 'League not found' }, { status: 404 });
    }
    
    // Check if user is the owner or has a team in the league
    const isOwner = league.ownerId === session.user.id;
    const hasTeam = league.teams.some(team => team.userId === session.user.id);
    
    if (!isOwner && !hasTeam) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json(league);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is the owner of the league
    const league = await prisma.league.findUnique({
      where: { id: params.id }
    });
    
    if (!league) {
      return NextResponse.json({ message: 'League not found' }, { status: 404 });
    }
    
    if (league.ownerId !== session.user.id) {
      return NextResponse.json({ message: 'Only the league owner can update league settings' }, { status: 403 });
    }

    const data = await request.json();
    const updatedLeague = await leagueService.updateLeague(params.id, data);
    
    return NextResponse.json(updatedLeague);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is the owner of the league
    const league = await prisma.league.findUnique({
      where: { id: params.id }
    });
    
    if (!league) {
      return NextResponse.json({ message: 'League not found' }, { status: 404 });
    }
    
    if (league.ownerId !== session.user.id) {
      return NextResponse.json({ message: 'Only the league owner can delete the league' }, { status: 403 });
    }

    const deletedLeague = await leagueService.deleteLeague(params.id);
    
    return NextResponse.json(deletedLeague);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
