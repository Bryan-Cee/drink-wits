import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

// GET /api/cards
export async function GET() {
  try {
    console.log('API: Fetching cards from database');
    const cards = await prisma.card.findMany({
      include: {
        favorites: true,
      },
    });

    console.log(`API: Found ${cards.length} cards in database`);

    // Return cards with a computed isFavorite field (would be checked against the user in a real app)
    const formattedCards = cards.map((card) => ({
      id: card.id,
      type: card.type,
      content: card.content,
      favoriteCount: card.favorites.length,
      isFavorite: false, // Add this field explicitly as it's expected by the CardDeck component
    }));

    console.log('API: Returning formatted cards:', formattedCards);
    return NextResponse.json(formattedCards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}
