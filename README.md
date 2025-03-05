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
- **Progressive Web App (PWA) capabilities**:
  - Offline support
  - Install to home screen
  - Fast loading times with caching
  - Smooth page transitions
  - Network status detection

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Prisma with SQLite (for development)
- **Authentication**: NextAuth.js
- **UI Components**: Custom components with Tailwind CSS
- **Animations**: Framer Motion for card swiping
- **PWA**: next-pwa with service worker and manifest

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

## Progressive Web App (PWA)

This application is configured as a Progressive Web App, providing several benefits:

### PWA Features
- **Offline Support**: Basic app functionality works without an internet connection
- **Installable**: Can be added to home screen on mobile devices and desktops
- **Fast Loading**: Service worker caches assets for faster subsequent loads
- **Network Detection**: Shows an indicator when the app is offline
- **Smooth Transitions**: Page transitions are animated for a better user experience

### PWA Setup
Before deploying to production:
1. Generate all required icons in the `/public/icons` directory (see `/public/icons/README.md` for details)
2. Test the service worker functionality in production mode
3. Verify the manifest.json configuration matches your app requirements

### Testing PWA Features
To test PWA features locally:
1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Open in a supported browser and use DevTools to verify service worker registration
4. Test offline functionality by turning off network in DevTools

## Project Structure

```
drink-wits/
├── prisma/                # Database schema and migrations
├── public/                # Static assets
│   ├── icons/             # PWA icons
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service worker
│   └── register-sw.js     # Service worker registration
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
