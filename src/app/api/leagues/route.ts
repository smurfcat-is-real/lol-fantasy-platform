import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { LeagueService } from '@/lib/services/league';
import { prisma } from '@/lib/prisma';

const leagueService = new LeagueService();

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const leagues = await leagueService.getUserLeagues(session.user.id);
    return NextResponse.json(leagues);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const league = await leagueService.createLeague({
      ...data,
      ownerId: session.user.id
    });
    
    return NextResponse.json(league, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
