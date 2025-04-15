import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { LeagueService } from '@/lib/services/league';

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

    const data = await request.json();
    const league = await leagueService.updateLeague(params.id, data);
    
    return NextResponse.json(league);
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

    const league = await leagueService.deleteLeague(params.id);
    
    return NextResponse.json(league);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
