import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample cards for the game
const cards = [
  {
    type: 'dare',
    content: 'Take a shot or do 10 push-ups',
  },
  {
    type: 'question',
    content: "What's the most embarrassing thing you've done while drunk?",
  },
  {
    type: 'dare',
    content: 'Let the group choose your profile picture for a day',
  },
  {
    type: 'question',
    content: "What's your go-to drunk food?",
  },
  {
    type: 'dare',
    content: 'Call the 5th contact in your phone and sing them happy birthday',
  },
  {
    type: 'question',
    content:
      'If you could only drink one type of alcohol for the rest of your life, what would it be?',
  },
  {
    type: 'dare',
    content: 'Text your ex saying you miss them (just kidding, text a friend instead)',
  },
  {
    type: 'question',
    content: "What's the worst hangover you've ever had?",
  },
  {
    type: 'dare',
    content: 'Let someone from the group post something on your social media',
  },
  {
    type: 'question',
    content: "What's your most embarrassing drunk text?",
  },
];

async function main() {
  console.log('Starting to seed database...');

  // Create cards
  for (const card of cards) {
    await prisma.card.create({
      data: card,
    });
  }

  // Create a test user
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123', // In a real app, this would be hashed
    },
  });

  console.log('Database seeded successfully!');
  console.log(`Created ${cards.length} cards`);
  console.log(`Created test user with email: ${user.email}`);

  return { cardsCount: cards.length, user };
}

main()
  .then(async (result) => {
    console.log('Seeding completed with result:', result);
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
