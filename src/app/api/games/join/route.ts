import { prisma } from '@/lib/db/prisma';
import { type NextRequest, NextResponse } from 'next/server';

// POST /api/games/join - Join a game with a join code
export async function POST(req: NextRequest) {
  // For joining, we don't require authentication
  try {
    const { joinCode, playerName, userId } = await req.json();

    if (!joinCode) {
      return NextResponse.json({ error: 'Join code is required' }, { status: 400 });
    }

    if (!playerName) {
      return NextResponse.json({ error: 'Player name is required' }, { status: 400 });
    }

    // Find the game session
    const gameSession = await prisma.gameSession.findUnique({
      where: {
        joinCode,
      },
    });

    if (!gameSession) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    // If userId is provided (user is logged in), add them to the game
    if (userId) {
      // Check if user already joined
      const existingParticipant = await prisma.userGameSession.findUnique({
        where: {
          userId_sessionId: {
            userId,
            sessionId: gameSession.id,
          },
        },
      });

      if (!existingParticipant) {
        // Add user to participants
        await prisma.userGameSession.create({
          data: {
            userId,
            sessionId: gameSession.id,
          },
        });
      }
    }

    // For guest users, we would handle differently in a real app
    // Maybe use session storage or cookies to track players

    return NextResponse.json({
      gameId: gameSession.id,
      gameName: gameSession.name,
      joinedAs: playerName,
    });
  } catch (error) {
    console.error('Error joining game:', error);
    return NextResponse.json({ error: 'Failed to join game' }, { status: 500 });
  }
}
