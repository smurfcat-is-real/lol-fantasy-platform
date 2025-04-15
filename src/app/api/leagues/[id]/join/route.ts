import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { LeagueService } from '@/lib/services/league';

const leagueService = new LeagueService();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { teamName } = await request.json();
    
    if (!teamName) {
      return NextResponse.json(
        { message: 'Team name is required' },
        { status: 400 }
      );
    }
    
    // Validate team name length
    if (teamName.length < 3 || teamName.length > 30) {
      return NextResponse.json(
        { message: 'Team name must be between 3 and 30 characters' },
        { status: 400 }
      );
    }

    try {
      const team = await leagueService.joinLeague(session.user.id, params.id, teamName);
      return NextResponse.json(team, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message || 'Failed to join league' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
