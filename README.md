# Drink Wits

A Tinder-style drinking game web application built with Next.js, where players can swipe through cards with dares or questions.

## Features

- Tinder-like card swiping interface
- Two card types: dares and questions
- User authentication system
- Ability to favorite cards
- Game session creation with shareable join links
- Multiple players can join a game session
- View popular cards among other players

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Prisma with SQLite (for development)
- **Authentication**: NextAuth.js
- **UI Components**: Custom components with Tailwind CSS
- **Animations**: Framer Motion for card swiping

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/drink-wits.git
   cd drink-wits
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
drink-wits/
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── game/          # Game-related pages
│   │   ├── profile/       # User profile pages
│   │   └── ...
│   ├── components/        # React components
│   │   ├── auth/          # Authentication components
│   │   ├── cards/         # Card-related components
│   │   ├── game/          # Game-related components
│   │   └── ui/            # UI components
│   ├── lib/               # Utility functions
│   │   ├── auth/          # Authentication utilities
│   │   └── db/            # Database utilities
│   └── types/             # TypeScript type definitions
└── ...
```

## How to Play

1. **Create a Game**: Start a new game session by entering a game name and player names.
2. **Share the Join Code**: Share the generated join code with friends to let them join your game.
3. **Join a Game**: Players can join using the join code and entering their name.
4. **Play the Game**: Swipe through cards with dares or questions. Swipe right to accept, left to skip.
5. **Favorite Cards**: Players can favorite cards they like (requires an account).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by popular drinking games and Tinder's swiping mechanism
- Built for educational purposes and responsible fun
