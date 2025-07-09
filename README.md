# ▶️ [Play Live Game](https://bingo-kappa-jade.vercel.app) | [Watch Demo on YouTube](https://youtu.be/SQt5HFz2JAQ)

## 🎯 Real-Time Multiplayer Bingo Game

A modern, production-ready multiplayer Bingo game platform built with cutting-edge technologies. Experience the classic game of Bingo with real-time synchronization, beautiful UI, and seamless multiplayer gam## 🙏 Acknowledgments

- Built with modern web technologies for optimal performance
- Inspired by the classic game of Bingo
- Designed for multiplayer real-time gaming experiences
- Features robust fallback systems for maximum reliability

---

## 🎮 Current Status: Live & Fully Functional

✅ **Production Deployment**: Game is live and playable at [bingo-kappa-jade.vercel.app](https://bingo-kappa-jade.vercel.app)  
✅ **Real-time Multiplayer**: Working with WebSocket + REST fallback  
✅ **Cross-platform**: Works on desktop and mobile devices  
✅ **Reliable**: Multiple connection methods ensure consistent gameplay

**Ready to play? [Start your Bingo game now!](https://bingo-kappa-jade.vercel.app)** 🎯🎉

---

*Last updated: January 2025 - Game fully operational and optimized for production use.*eview](https://img.shields.io/badge/Status-Live%20%26%20Working-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-10+-E0234E)
![Deployment](https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-success)

## ✨ Features

### 🎮 Core Game Features

- **Real-Time Multiplayer**: Up to 4 players per room with instant synchronization
- **Private Board Privacy**: Each player sees only their own board
- **Smart Number Marking**: When a player marks a number, it's automatically marked on all other players' boards if present
- **Dynamic BINGO Detection**: Real-time detection of completed lines (horizontal, vertical, diagonal)
- **Instant Win Detection**: First player to complete 5 BINGO lines wins immediately
- **No FREE Space**: Challenging 25-number boards (1-25) without traditional FREE center space

### 🌐 Technical Features

- **Hybrid Connectivity**: WebSocket for real-time play + REST API fallback for reliability
- **Smart Connection Management**: Automatic fallback when WebSocket issues occur
- **Production-Ready Architecture**: Deployed on Vercel (frontend) + Render (backend)
- **Room Management**: Create and join rooms with unique IDs
- **Turn-Based Gameplay**: Clear turn indicators and game flow
- **Game Reset**: Room creators can start new games
- **Responsive Design**: Beautiful UI that works on all devices
- **CORS-Optimized**: Configured for cross-origin requests in production

### 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with excellent contrast
- **Winner Celebration**: Prominent winner announcements with player names
- **Real-Time Status**: Live game state and player status updates
- **Intuitive Controls**: Easy-to-use game controls and navigation
- **Visual Feedback**: Clear indicators for marked numbers and game progress

## 🏗️ Architecture

### Project Structure

```
bingo/
├── README.md                      # Project documentation
├── vercel.json                    # Vercel deployment config
├── a/                             # Legacy frontend demo
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── images/
├── backend/                       # NestJS API Server
│   ├── src/
│   │   ├── main.ts                # Application entry point
│   │   ├── app.module.ts          # Main application module
│   │   ├── app.controller.ts      # Basic app controller
│   │   ├── app.service.ts         # Basic app service
│   │   ├── bingo/
│   │   │   ├── bingo-engine.service.ts # Core Bingo game logic
│   │   │   └── bingo.module.ts    # Bingo module
│   │   ├── game/
│   │   │   ├── game.controller.ts # REST API endpoints
│   │   │   ├── game.gateway.ts    # WebSocket event handling
│   │   │   ├── game.service.ts    # Game state management
│   │   │   ├── game.module.ts     # Game module
│   │   │   └── dto/               # Data transfer objects
│   │   │       ├── create-room.dto.ts
│   │   │       ├── join-room.dto.ts
│   │   │       └── game-action.dto.ts
│   │   └── common/
│   │       ├── interfaces/
│   │       │   └── game.interface.ts # Shared interfaces
│   │       └── utils/
│   │           └── game.utils.ts  # Utility functions
│   ├── test/                      # E2E tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── nest-cli.json
│   └── eslint.config.mjs
└── frontend/                      # Next.js React App
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx           # Main application page
    │   │   ├── page_new.tsx       # Alternative page implementation
    │   │   ├── layout.tsx         # App layout
    │   │   ├── globals.css        # Global styles
    │   │   └── favicon.ico
    │   ├── components/
    │   │   ├── HomePage.tsx       # Home page component
    │   │   ├── GameRoom.tsx       # Game room interface
    │   │   ├── BingoBoard.tsx     # Main Bingo board component
    │   │   ├── BingoBoard_old.tsx # Legacy board implementation
    │   │   ├── BingoBoard_new.tsx # Alternative board implementation
    │   │   ├── BingoBoard_fixed.tsx # Fixed board implementation
    │   │   ├── PlayerCard.tsx     # Player status display
    │   │   └── Notification.tsx   # Game notifications
    │   ├── contexts/
    │   │   └── SocketContext.tsx  # WebSocket context provider
    │   ├── hooks/
    │   │   └── useGame.ts         # Game state management hook
    │   └── types/
    │       └── game.ts            # TypeScript type definitions
    ├── public/                    # Static assets
    ├── package.json
    ├── next.config.ts
    ├── tsconfig.json
    ├── postcss.config.mjs
    └── next-env.d.ts
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

## � Live Deployment

### Production URLs

- **Frontend**: [https://bingo-kappa-jade.vercel.app](https://bingo-kappa-jade.vercel.app) (Vercel)
- **Backend**: Deployed on Render with auto-scaling

### Deployment Status

- ✅ **Frontend**: Live and working on Vercel
- ✅ **Backend**: Live and working on Render
- ✅ **WebSocket**: Real-time connections established
- ✅ **REST API**: Fallback system functional
- ✅ **CORS**: Configured for production domains

### Architecture Benefits

- **High Availability**: Multiple connection methods ensure reliability
- **Auto-Scaling**: Render backend scales based on demand
- **Global CDN**: Vercel provides fast worldwide access
- **Fault Tolerance**: REST API fallback when WebSocket issues occur

## �🎯 How to Play

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

## 🐛 Troubleshooting & Known Issues

### ✅ Current Status (As of Latest Update)

- **Game Functionality**: ✅ Fully working
- **Room Creation**: ✅ Working via REST API fallback
- **Multiplayer**: ✅ Real-time synchronization working
- **Deployment**: ✅ Live on Vercel + Render

### 🔧 Connection Issues (Resolved)

**WebSocket Connection Warnings** ⚠️

- **Status**: Non-critical warnings in development
- **Impact**: None - REST API fallback handles all functionality
- **Solution**: Automatic fallback to HTTP requests when WebSocket has issues

**"Bad Request" Errors** ✅ Fixed

- **Cause**: Form validation or empty fields
- **Solution**: Enhanced client-side validation and better error messages
- **Prevention**: Forms now validate input before sending to server

### 🚀 Development Issues (Resolved)

**Yarn SWC Dependencies Warning** ⚠️

- **Status**: Cosmetic warning only
- **Impact**: No functional impact on development
- **Workaround**: Server starts successfully despite warnings

**CORS Configuration** ✅ Fixed

- **Issue**: Cross-origin requests blocked in production
- **Solution**: Comprehensive CORS setup for all deployment domains
- **Status**: Working for both localhost and production URLs

### 🔍 Quick Fixes

1. **If room creation fails**: Check browser console for validation errors
2. **If connection issues**: App automatically uses REST API fallback
3. **If game doesn't start**: Ensure minimum 2 players in room
4. **If moves don't register**: Check turn order - wait for your turn

### 📞 Support

- Frontend is responsive and works on all modern devices
- REST API provides 100% functionality backup for WebSocket
- All game features work reliably in production environment

## 🤝 Contributing

We welcome contributions! Here's how you can help improve the game:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Areas for Contribution

- 🎨 UI/UX improvements
- 🔧 Performance optimizations
- 🎮 New game features
- 🐛 Bug fixes
- 📱 Mobile responsiveness enhancements

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
