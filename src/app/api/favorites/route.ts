import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/favorites - Get all favorites for the current user
export async function GET(req: NextRequest) {
  // In a real app, get userId from the session
  const userId = req.headers.get('user-id');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        card: true,
      },
    });
    
    const formattedFavorites = favorites.map(fav => ({
      id: fav.card.id,
      type: fav.card.type,
      content: fav.card.content,
      favoriteId: fav.id,
      favoriteDate: fav.createdAt,
    }));
    
    return NextResponse.json(formattedFavorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Toggle favorite status of a card
export async function POST(req: NextRequest) {
  // In a real app, get userId from the session
  const userId = req.headers.get('user-id');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  try {
    const { cardId } = await req.json();
    
    if (!cardId) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }
    
    // Check if favorite already exists
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_cardId: {
          userId,
          cardId,
        },
      },
    });
    
    let result;
    
    if (existingFavorite) {
      // Remove the favorite
      result = await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      
      return NextResponse.json({ status: 'removed' });
    } else {
      // Add as favorite
      result = await prisma.favorite.create({
        data: {
          userId,
          cardId,
        },
      });
      
      return NextResponse.json({ status: 'added' });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json(
      { error: 'Failed to update favorite' },
      { status: 500 }
    );
  }
} 