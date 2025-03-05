import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateRandomCode } from '@/lib/utils';

// Function to generate a unique join code
async function generateUniqueJoinCode(supabase: any) {
  let isUnique = false;
  let joinCode = '';
  
  while (!isUnique) {
    // Generate a random 6-character alphanumeric code
    joinCode = generateRandomCode(6).toUpperCase();
    
    // Check if this code already exists
    const { data, error } = await supabase
      .from('games')
      .select('id')
      .eq('join_code', joinCode)
      .single();
      
    if (error && error.code === 'PGRST116') {
      // PGRST116 means no rows returned - the code is unique
      isUnique = true;
    } else if (error) {
      console.error('Error checking join code uniqueness:', error);
      // If there's a different error, generate a new code to be safe
      continue;
    }
    
    // If no error but no data, the code is unique
    if (!data) {
      isUnique = true;
    }
  }
  
  return joinCode;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('Authentication required for game creation');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get the user ID from the session
    const userId = session.user.id;
    console.log('Creating game for user:', userId);
    
    // Get the game details from the request body
    const body = await request.json();
    const { name } = body;
    
    if (!name) {
      console.error('Game name is required but was not provided');
      return NextResponse.json(
        { error: 'Game name is required' },
        { status: 400 }
      );
    }
    
    console.log('Generating join code for game:', name);
    // Generate a unique join code
    const joinCode = await generateUniqueJoinCode(supabase);
    console.log('Generated join code:', joinCode);
    
    // Create the game
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .insert([
        {
          name,
          created_by: userId,
          join_code: joinCode,
          created_at: new Date().toISOString(),
          status: 'waiting' // waiting, active, completed
        }
      ])
      .select()
      .single();
    
    if (gameError) {
      console.error('Database error creating game:', gameError);
      return NextResponse.json(
        { error: `Failed to create game: ${gameError.message}` },
        { status: 500 }
      );
    }
    
    console.log('Game created successfully:', gameData.id);

    // Add the creator as the first player
    const userName = session.user.user_metadata?.full_name || session.user.email || 'Game Host';
    
    const { error: playerError } = await supabase
      .from('players')
      .insert([
        {
          game_id: gameData.id,
          user_id: userId,
          name: userName,
          is_anonymous: false,
          joined_at: new Date().toISOString(),
          status: 'active',
          score: 0
        }
      ]);
    
    if (playerError) {
      console.error('Error adding host as player:', playerError);
      // We'll still return success even if adding the player fails
      // because the game was created successfully
    }
    
    return NextResponse.json({
      success: true,
      message: 'Game created successfully',
      gameId: gameData.id,
      joinCode: gameData.join_code
    });
    
  } catch (error) {
    console.error('Unexpected error creating game:', error);
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 