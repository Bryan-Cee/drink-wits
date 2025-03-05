import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get the user ID from the session
    const userId = session.user.id;
    
    // Get the card ID from the request body
    const { cardId, gameId } = await request.json();
    
    if (!cardId) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the card is already favorited by this user
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('card_id', cardId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Error checking existing favorite' },
        { status: 500 }
      );
    }
    
    // If already favorited, return success without duplicating
    if (existingFavorite) {
      return NextResponse.json({ 
        success: true,
        message: 'Card already in favorites',
        favorite: existingFavorite
      });
    }
    
    // Add the card to favorites
    const { data, error } = await supabase.from('favorites').insert([
      {
        user_id: userId,
        card_id: cardId,
        created_at: new Date().toISOString(),
      },
    ]).select().single();
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to add favorite' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Card added to favorites',
      favorite: data,
      gameId: gameId // Pass back the game ID for potential redirects
    });
    
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 