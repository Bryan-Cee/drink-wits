# Drink Wits - Technical Architecture

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture Overview](#architecture-overview)
- [Component Structure](#component-structure)
- [Authentication Flow](#authentication-flow)
- [Game Session Flow](#game-session-flow)
- [Real-time Synchronization](#real-time-synchronization)
- [Database Schema](#database-schema)
- [State Management](#state-management)
- [Form Validation](#form-validation)
- [API Interface](#api-interface)

## Project Overview

Drink Wits is a real-time, multiplayer card game application built with Next.js that allows users to create and join game sessions, interact with cards through a swipe-based interface, and save their favorite cards. The application uses Supabase for authentication and data persistence, Socket.IO for real-time communication, and Zustand for state management.

## Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                       Next.js Application                  │
│                                                            │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │             │    │              │    │               │  │
│  │     UI      │◄──►│  Client-Side │◄──►│  Server-Side  │  │
│  │ Components  │    │     Logic    │    │     Logic     │  │
│  │             │    │              │    │               │  │
│  └─────────────┘    └──────────────┘    └───────┬───────┘  │
│                                                 │          │
└─────────────────────────────────────────────────┼──────────┘
                                                  │
                                                  ▼
┌────────────────────────┐    ┌───────────────────────────────┐
│                        │    │                               │
│  Supabase              │    │  Socket.IO Server             │
│  - Authentication      │◄──►│  - Real-time Communication    │
│  - Database            │    │  - Game State Synchronization │
│  - Storage             │    │                               │
│                        │    │                               │
└────────────────────────┘    └───────────────────────────────┘
```

The application architecture follows these key design patterns:

1. **App Router Architecture**: Next.js 13+ app router for routing and server components
2. **Client-Side State Management**: Zustand for global state management
3. **Real-time Communication**: Socket.IO for bidirectional WebSocket communication
4. **Backend as a Service**: Supabase for authentication, database, and storage
5. **Form Management**: React Hook Form with Yup schema validation
6. **Component Structure**: Feature-based organization with shared components

## Component Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── auth/             # Authentication-related pages
│   │   ├── callback/     # OAuth callback handling
│   │   ├── login/        # Login page
│   │   └── register/     # Registration page
│   ├── game/             # Game-related pages
│   │   ├── create/       # Create game page
│   │   ├── join/         # Join game page
│   │   └── play/         # Game play page
│   └── layout.tsx        # Root layout with authentication provider
├── components/           # Reusable React components
│   ├── auth/             # Authentication components
│   │   └── LoginForm.tsx # Login form with OAuth
│   ├── cards/            # Card-related components
│   │   ├── CardDeck.tsx  # Card deck with swipe functionality
│   │   └── GameCard.tsx  # Individual card component
│   └── game/             # Game-related components
│       ├── CreateGameForm.tsx # Form for creating games
│       └── JoinGameForm.tsx   # Form for joining games
├── lib/                  # Shared libraries and utilities
│   ├── auth/             # Authentication utilities
│   │   └── auth-context.tsx # Context provider for auth state
│   ├── hooks/            # Custom React hooks
│   │   └── use-favorites.ts # Hook for favorites functionality
│   ├── socket/           # Socket.IO integration
│   │   └── socket-server.ts # Server-side Socket.IO setup
│   ├── store/            # State management
│   │   └── game-store.ts # Zustand store for game state
│   ├── supabase/         # Supabase client configuration
│   │   ├── client.ts     # Browser client
│   │   └── server.ts     # Server-side client
│   └── validation/       # Form validation schemas
│       ├── join-game-schema.ts  # Validation for join game
│       └── create-game-schema.ts # Validation for create game
└── pages/                # Pages directory (API routes)
    └── api/              # API endpoints
        └── socket.ts     # Socket.IO API endpoint
```

## Authentication Flow

```
┌──────────┐     ┌───────────────┐     ┌─────────────────┐
│          │     │               │     │                 │
│  User    │────►│  LoginForm    │────►│  AuthContext    │
│          │     │  Component    │     │  (Provider)     │
│          │     │               │     │                 │
└──────────┘     └───────────────┘     └────────┬────────┘
                                                │
                                                ▼
┌──────────────────┐     ┌────────────────────────────────┐
│                  │     │                                │
│  Auth Callback   │◄────┤  Supabase Authentication       │
│  Route           │     │  (OAuth with Google)           │
│                  │     │                                │
└─────────┬────────┘     └────────────────────────────────┘
          │
          ▼
┌──────────────────┐
│                  │
│  Redirect to     │
│  Protected Page  │
│                  │
└──────────────────┘
```

### Authentication Process:

1. User initiates login through the `LoginForm` component
2. The form uses the `signIn` method from `AuthContext`
3. `AuthContext` calls Supabase authentication with the Google provider
4. Supabase redirects to the OAuth provider (Google)
5. After authentication, the user is redirected to the `/auth/callback` route
6. The callback route exchanges the code for a session
7. The user is redirected to the protected page
8. `AuthContext` uses Supabase session management to keep the user authenticated

## Game Session Flow

```
┌──────────┐     ┌─────────────────┐     ┌────────────────┐
│          │     │                 │     │                │
│  User 1  │────►│  CreateGameForm │────►│  Game Server   │
│          │     │  Component      │     │                │
│          │     │                 │     │                │
└──────────┘     └─────────────────┘     └────────┬───────┘
                                                  │
                                                  │
┌──────────┐     ┌─────────────────┐     ┌────────▼───────┐
│          │     │                 │     │                │
│  User 2  │────►│  JoinGameForm   │────►│  Game Session  │
│          │     │  Component      │     │                │
│          │     │                 │     │                │
└──────────┘     └─────────────────┘     └────────┬───────┘
                                                  │
                                                  │
┌────────────┐     ┌───────────────┐     ┌────────▼───────┐
│            │     │               │     │                │
│  CardDeck  │◄────┤  GameStore    │◄────┤  Socket.IO     │
│  Component │     │  (Zustand)    │     │  Connection    │
│            │     │               │     │                │
└────────────┘     └───────────────┘     └────────────────┘
```

### Game Creation Process:

1. User 1 fills out the `CreateGameForm` with game name and player names
2. The form submits data to the server, which creates a game session
3. The server returns a join code
4. User 1 can share the join code with other players
5. User 1 clicks "Start Game" to navigate to the game play page

### Game Joining Process:

1. User 2 enters the join code in the `JoinGameForm`
2. The form validates the code and navigates to the game play page
3. The Socket.IO connection is established

### Game Play Process:

1. Each user connects to the Socket.IO server using the game ID and player name
2. The `CardDeck` component uses the `GameStore` to manage game state
3. Card swipes and interactions are synchronized across players using Socket.IO

## Real-time Synchronization

```
┌─────────────────┐                      ┌─────────────────┐
│                 │                      │                 │
│  Client 1       │                      │  Client 2       │
│  ┌───────────┐  │                      │  ┌───────────┐  │
│  │ GameStore │  │                      │  │ GameStore │  │
│  └─────┬─────┘  │                      │  └─────┬─────┘  │
│        │        │                      │        │        │
│  ┌─────▼─────┐  │                      │  ┌─────▼─────┐  │
│  │ Socket.IO │  │                      │  │ Socket.IO │  │
│  │ Client    │  │                      │  │ Client    │  │
│  └─────┬─────┘  │                      │  └─────┬─────┘  │
│        │        │                      │        │        │
└────────┼────────┘                      └────────┼────────┘
         │                                        │
         │                                        │
         │        ┌─────────────────┐             │
         │        │                 │             │
         └───────►│  Socket.IO      │◄────────────┘
                  │  Server         │
                  │                 │
                  └─────────────────┘
                          ▲
                          │
                          │
                  ┌───────┴───────┐
                  │               │
                  │  Game Rooms   │
                  │  & State      │
                  │               │
                  └───────────────┘
```

### Socket.IO Communication Flow:

1. Users connect to the Socket.IO server when entering a game
2. Each game has a unique room identified by the game ID
3. When a user changes the card (swipes), their client:
   - Updates the local state
   - Emits a `change-card` event to the server
4. The server:
   - Updates the game state
   - Broadcasts the `card-changed` event to all other clients in the room
5. Other clients receive the event and update their local state
6. The player list is synchronized using `player-joined` and `player-left` events

## Database Schema

```
┌────────────────┐       ┌────────────────┐       ┌────────────────┐
│                │       │                │       │                │
│    profiles    │       │ game_sessions  │       │     cards      │
│                │       │                │       │                │
│ id             │       │ id             │       │ id             │
│ user_id        │◄─────►│ creator_id     │       │ content        │
│ display_name   │       │ name           │       │ type           │
│ avatar_url     │       │ join_code      │       │ created_at     │
│ created_at     │       │ created_at     │       │ updated_at     │
│ updated_at     │       │ updated_at     │       │                │
│                │       │                │       │                │
└────────┬───────┘       └───────┬────────┘       └───────┬────────┘
         │                       │                        │
         │                       │                        │
         │                       │                        │
         │               ┌───────▼────────┐               │
         │               │                │               │
         └───────────────┤user_game_      │               │
                         │sessions        │               │
                         │                │               │
                         │id              │               │
                         │user_id         │               │
                         │session_id      │               │
                         │created_at      │               │
                         │                │               │
                         └────────────────┘               │
                                                          │
         ┌────────────────┐                               │
         │                │                               │
         │    users       │                               │
         │                │                               │
         │ id             │                               │
         │ email          │                               │
         │ created_at     │                               │
         │                │                               │
         └────────┬───────┘                               │
                  │                                       │
                  │                                       │
                  │                                       │
                  │               ┌────────────────┐      │
                  │               │                │      │
                  └───────────────┤   favorites    │◄─────┘
                                  │                │
                                  │ id             │
                                  │ user_id        │
                                  │ card_id        │
                                  │ created_at     │
                                  │                │
                                  └────────────────┘
```

## State Management

### Zustand Game Store

The application uses Zustand for global state management, primarily for the game state:

```javascript
interface GameState {
  // Game data
  gameId: string | null;
  currentCardIndex: number;
  players: string[];
  cards: Card[];
  
  // Socket connection
  socket: Socket | null;
  isConnected: boolean;
  
  // Actions
  initializeSocket: (gameId: string, userName: string) => void;
  disconnectSocket: () => void;
  syncCardIndex: (newIndex: number) => void;
  setCards: (cards: Card[]) => void;
  updateCardIndex: (index: number) => void;
  addPlayer: (playerName: string) => void;
  removePlayer: (playerName: string) => void;
}
```

### Authentication Context

User authentication state is managed through React Context:

```javascript
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (provider: 'google') => Promise<void>;
  signOut: () => Promise<void>;
};
```

### Component-Level State

Individual components manage their own state using React's `useState`:

- Forms track submission state and validation errors
- UI components track interaction states (e.g., drag state in card components)
- Modal and dropdown visibility states

## Form Validation

The application uses React Hook Form with Yup schemas for form validation:

```
┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│                │      │                │      │                │
│  Form          │      │  React Hook    │      │  Yup Schema    │
│  Component     │◄────►│  Form          │◄────►│  Validation    │
│                │      │                │      │                │
└────────────────┘      └────────────────┘      └────────────────┘
```

### Join Game Schema

```javascript
export const joinGameSchema = yup.object({
  joinCode: yup
    .string()
    .required('Join code is required')
    .min(6, 'Join code must be at least 6 characters'),
  playerName: yup
    .string()
    .required('Player name is required')
    .min(2, 'Player name must be at least 2 characters')
    .max(20, 'Player name must not exceed 20 characters')
});
```

### Create Game Schema

```javascript
export const createGameSchema = yup.object({
  gameName: yup
    .string()
    .required('Game name is required')
    .min(3, 'Game name must be at least 3 characters')
    .max(30, 'Game name must not exceed 30 characters'),
  players: yup
    .array()
    .of(
      yup
        .string()
        .required('Player name is required')
        .min(2, 'Player name must be at least 2 characters')
        .max(20, 'Player name must not exceed 20 characters')
    )
    .min(1, 'At least one player is required')
    .max(10, 'Maximum 10 players allowed')
});
```

## API Interface

### Socket.IO API

The Socket.IO server handles these events:

1. **connection**: Establishes a new socket connection
2. **join-game**: Adds a player to a game room
3. **change-card**: Updates the current card index and broadcasts to others
4. **disconnect**: Removes a player from a game room

### Supabase API

The Supabase client handles these operations:

1. **Authentication**: Sign-in with Google, session management
2. **Database Operations**: CRUD operations on game sessions, favorites, profiles
3. **Storage**: For avatar images and any other assets

### Custom Hooks

The application uses custom hooks to encapsulate and reuse logic:

1. **useFavorites**: Handles saving and retrieving favorite cards
2. **useAuth**: Simplified access to authentication context
3. **useGameStore**: Simplified access to global game state 