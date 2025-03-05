import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/games/join - Join a game with a join code
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the join code and player name from the request body
    const { joinCode, playerName } = await request.json();
    
    if (!joinCode || !playerName) {
      return NextResponse.json(
        { error: 'Join code and player name are required' },
        { status: 400 }
      );
    }
    
    // Get the user's session (if they're logged in)
    const { data: { session } } = await supabase.auth.getSession();
    
    // Find the game by join code
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id, name, status')
      .eq('join_code', joinCode)
      .single();
    
    if (gameError) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }
    
    if (game.status === 'completed') {
      return NextResponse.json(
        { error: 'This game has already ended' },
        { status: 400 }
      );
    }
    
    // Create a player record
    const { data: player, error: playerError } = await supabase
      .from('players')
      .insert([
        {
          game_id: game.id,
          name: playerName,
          user_id: session?.user?.id || null, // Link to user if logged in
          is_anonymous: !session,
          joined_at: new Date().toISOString(),
          status: 'active'
        }
      ])
      .select()
      .single();
    
    if (playerError) {
      console.error('Error adding player:', playerError);
      return NextResponse.json(
        { error: 'Failed to join game' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully joined game',
      gameId: game.id,
      playerId: player.id
    });
    
  } catch (error) {
    console.error('Error joining game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
