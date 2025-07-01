# ▶️ [Watch the Demo Video on YouTube](https://youtu.be/SQt5HFz2JAQ)

## � Real-Time Multiplayer Bingo Game

A modern, production-ready multiplayer Bingo game platform built with cutting-edge technologies. Experience the classic game of Bingo with real-time synchronization, beautiful UI, and seamless multiplayer gameplay.

![Game Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-10+-E0234E)

## ✨ Features

### 🎮 Core Game Features

- **Real-Time Multiplayer**: Up to 4 players per room with instant synchronization
- **Private Board Privacy**: Each player sees only their own board
- **Smart Number Marking**: When a player marks a number, it's automatically marked on all other players' boards if present
- **Dynamic BINGO Detection**: Real-time detection of completed lines (horizontal, vertical, diagonal)
- **Instant Win Detection**: First player to complete 5 BINGO lines wins immediately
- **No FREE Space**: Challenging 25-number boards (1-25) without traditional FREE center space

### 🌐 Technical Features

- **WebSocket Real-Time Communication**: Instant game state synchronization
- **REST API Fallback**: Robust connectivity with HTTP endpoint fallbacks
- **Room Management**: Create and join rooms with unique IDs
- **Turn-Based Gameplay**: Clear turn indicators and game flow
- **Game Reset**: Room creators can start new games
- **Responsive Design**: Beautiful UI that works on all devices

### 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with excellent contrast
- **Winner Celebration**: Prominent winner announcements with player names
- **Real-Time Status**: Live game state and player status updates
- **Intuitive Controls**: Easy-to-use game controls and navigation
- **Visual Feedback**: Clear indicators for marked numbers and game progress

## 🏗️ Architecture

### Backend (NestJS)

```
backend/
├── src/
│   ├── app.module.ts              # Main application module
│   ├── main.ts                    # Application entry point
│   ├── bingo/
│   │   └── bingo-engine.service.ts # Core Bingo game logic
│   ├── game/
│   │   ├── game.service.ts        # Game state management
│   │   ├── game.gateway.ts        # WebSocket event handling
│   │   ├── game.controller.ts     # REST API endpoints
│   │   └── dto/                   # Data transfer objects
│   └── common/
│       └── interfaces/            # Shared type definitions
├── prisma/
│   └── schema.prisma              # Database schema
└── package.json
```

### Frontend (Next.js)

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Main application page
│   │   ├── layout.tsx             # App layout
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── HomePage.tsx           # Home page component
│   │   ├── GameRoom.tsx           # Game room interface
│   │   ├── BingoBoard.tsx         # Interactive Bingo board
│   │   ├── PlayerCard.tsx         # Player status display
│   │   └── Notification.tsx       # Game notifications
│   ├── contexts/
│   │   └── SocketContext.tsx      # WebSocket context provider
│   ├── hooks/
│   │   └── useGame.ts             # Game state management hook
│   └── types/
│       └── game.ts                # TypeScript type definitions
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn package manager
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bingo
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   yarn install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   yarn install
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   yarn start:dev
   ```

   Backend will run on `http://localhost:3001`

2. **Start the frontend development server**

   ```bash
   cd frontend
   yarn dev
   ```

   Frontend will run on `http://localhost:3000`

3. **Open your browser**
   Navigate to `http://localhost:3000` to start playing!

## 🎯 How to Play

1. **Create or Join a Room**

   - Create a new room with a custom name
   - Or join an existing room using the Room ID

2. **Wait for Players**

   - Minimum 2 players required to start
   - Maximum 4 players per room
   - Room creator can start the game when ready

3. **Play the Game**

   - Each player gets a unique 5x5 board with numbers 1-25
   - Take turns marking numbers on your board
   - When you mark a number, it's automatically marked on other players' boards if they have it
   - Complete horizontal, vertical, or diagonal lines to achieve BINGO

4. **Win the Game**
   - First player to complete 5 BINGO lines wins!
   - Winner is announced with their name
   - Room creator can start a new game

## 🛠️ Technology Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Socket.IO** - Real-time WebSocket communication
- **Prisma** - Modern database toolkit
- **Class Validator** - Input validation
- **UUID** - Unique identifier generation

### Frontend

- **Next.js 14** - React framework with App Router
- **React 18** - UI component library
- **TypeScript** - Type-safe development
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Hooks** - Reusable game logic

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Yarn** - Package management
- **Hot Reload** - Development efficiency

## 📡 API Reference

### REST Endpoints

#### Create Room

```http
POST /api/game/rooms
Content-Type: application/json

{
  "roomName": "My Game Room",
  "playerName": "Player1"
}
```

#### Join Room

```http
POST /api/game/rooms/join
Content-Type: application/json

{
  "roomId": "uuid-room-id",
  "playerName": "Player2"
}
```

#### Get Room Info

```http
GET /api/game/rooms/{roomId}
```

### WebSocket Events

#### Client to Server

- `create_room` - Create a new game room
- `join_room` - Join an existing room
- `start_game` - Start the game (creator only)
- `make_move` - Mark a number on the board
- `reset_game` - Reset the game (creator only)
- `leave_room` - Leave the current room

#### Server to Client

- `room_created` - Room creation response
- `room_joined` - Room join response
- `room_updated` - Room state updates
- `game_started` - Game start notification
- `player_move` - Player move notification
- `game_finished` - Game completion with winner
- `error` - Error messages

## 🔧 Configuration

### Environment Variables

**Backend** (Optional)

```env
PORT=3001
NODE_ENV=development
```

**Frontend** (Optional)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🎨 Game Rules

1. **Board Generation**: Each player receives a unique 5x5 board with numbers 1-25
2. **Turn-Based Play**: Players take turns marking numbers on their boards
3. **Number Propagation**: Marked numbers affect all players who have that number
4. **BINGO Lines**: Complete rows, columns, or diagonals count as BINGO
5. **Winning Condition**: First player to achieve 5 BINGO lines wins
6. **Game Reset**: Only room creators can start new games

## 🐛 Troubleshooting

### Common Issues

**Connection Issues**

- Ensure both backend (3001) and frontend (3000) servers are running
- Check firewall settings for local development
- Verify WebSocket connections in browser dev tools

**Game State Issues**

- Refresh the page to reconnect to the game
- Check browser console for error messages
- Ensure all players are using the same game version

**Performance Issues**

- Use modern browsers with WebSocket support
- Close unnecessary browser tabs
- Check network connectivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies for optimal performance
- Inspired by the classic game of Bingo
- Designed for multiplayer real-time gaming experiences

---

**Ready to play? Start your Bingo game now!** 🎯🎉en Bingo Game

## A revolutionary real-time multiplayer Bingo experience — reimagined with modern full-stack technologies.

This project is not just a browser-based Bingo game anymore. It’s a scalable, multiplayer, real-time web application that transforms the classic Bingo into a seamless, interactive, and social game platform.

With cutting-edge technologies like `React`, `NestJS`, `Prisma`, `WebSockets`, and `OAuth2`, our Bingo is built for performance, security, and ultimate user experience — ready to scale for massive multiplayer support.

```sql
Persuasive Post
```
