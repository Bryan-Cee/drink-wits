import { prisma } from '@/lib/db/prisma';
import { type NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// GET /api/games - Get games created by the current user
export async function GET(req: NextRequest) {
  // In a real app, get userId from the session
  const userId = req.headers.get('user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const games = await prisma.gameSession.findMany({
      where: {
        creatorId: userId,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

// POST /api/games - Create a new game
export async function POST(req: NextRequest) {
  // In a real app, get userId from the session
  const userId = req.headers.get('user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { name, players } = await req.json();

    if (!name || !players || !Array.isArray(players) || players.length === 0) {
      return NextResponse.json(
        { error: 'Name and at least one player are required' },
        { status: 400 }
      );
    }

    // Generate a random join code (6 characters)
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create the game session
    const game = await prisma.gameSession.create({
      data: {
        name,
        joinCode,
        creatorId: userId,
      },
    });

    // For a real app, we would invite players or handle this differently
    // For now, we'll just return the join code

    return NextResponse.json({
      gameId: game.id,
      joinCode: game.joinCode,
    });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}
