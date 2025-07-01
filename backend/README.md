# 🎮 Bingo Game Backend

A real-time multiplayer Bingo game backend built with NestJS, WebSockets, and Socket.IO. Inspired by platforms like scribbl.io, this backend supports room-based gameplay with no authentication required.

## 🚀 Features

- **Real-time Multiplayer**: WebSocket-based communication for instant gameplay
- **Room-based System**: Create or join rooms with 2-4 players
- **Turn-based Gameplay**: Players take turns marking cells on their Bingo boards
- **Live Game State**: Real-time updates for all players in a room
- **No Authentication**: Quick join with just a username
- **Scalable Architecture**: Production-ready modular structure
- **TypeScript**: Fully typed for better developer experience

## 🏗️ Architecture

```
src/
├── bingo/                    # Core Bingo game engine
│   ├── bingo-engine.service.ts    # Game logic (board generation, win detection)
│   └── bingo.module.ts
├── game/                     # Game management
│   ├── dto/                  # Data Transfer Objects
│   ├── game.controller.ts    # HTTP API endpoints
│   ├── game.gateway.ts       # WebSocket events
│   ├── game.service.ts       # Business logic
│   └── game.module.ts
├── common/                   # Shared utilities
│   ├── interfaces/           # TypeScript interfaces
│   └── utils/               # Utility functions
└── main.ts                  # Application entry point
```

## 🎯 Game Rules

1. **Room Creation**: Any player can create a room (becomes the creator)
2. **Joining**: Players can join existing rooms (max 4 players)
3. **Starting**: Only room creator can start the game (min 2 players required)
4. **Gameplay**: Players take turns marking cells on their 5x5 Bingo board
5. **Winning**: First player to get 5 complete lines (horizontal, vertical, or diagonal) wins
6. **New Game**: Room creator can reset for another round

## 📡 API Endpoints

### HTTP REST API

```bash
# Health Check
GET /api/game/health

# Create Room
POST /api/game/rooms
{
  "roomName": "My Bingo Room",
  "playerName": "Player1"
}

# Join Room
POST /api/game/rooms/join
{
  "roomId": "room-uuid",
  "playerName": "Player2"
}

# Get Room Info
GET /api/game/rooms/:roomId

# List All Rooms
GET /api/game/rooms
```

### WebSocket Events

#### Client → Server Events

- `create_room` - Create a new game room
- `join_room` - Join an existing room
- `leave_room` - Leave current room
- `start_game` - Start the game (creator only)
- `make_move` - Mark a cell on the board
- `reset_game` - Reset game for new round (creator only)
- `get_room_state` - Get current room state

#### Server → Client Events

- `room_created` - Room creation successful
- `room_joined` - Successfully joined room
- `player_joined` - Another player joined
- `player_left` - Player left the room
- `game_started` - Game has begun
- `player_move` - Player made a move
- `game_finished` - Game ended with winner
- `room_updated` - Room state changed
- `move_success/move_failed` - Move result

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- Yarn package manager

### Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn start:dev

# Build for production
yarn build

# Start production server
yarn start:prod
```

The server will start on `http://localhost:3001`

## 🎮 Usage Example

### JavaScript Client Example

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

// Create a room
socket.emit('create_room', {
  roomName: 'My Game',
  playerName: 'Alice',
});

socket.on('room_created', (data) => {
  console.log('Room created:', data);
  // Store roomId and playerId
});

// Join a room
socket.emit('join_room', {
  roomId: 'room-id',
  playerName: 'Bob',
});

// Make a move
socket.emit('make_move', {
  roomId: 'room-id',
  playerId: 'player-id',
  cellNumber: 12,
});

// Listen for game events
socket.on('player_move', (data) => {
  console.log('Player moved:', data);
});

socket.on('game_finished', (data) => {
  console.log('Game won by:', data.winner);
});
```

## 🏆 Game Flow

1. **Room Creation/Joining**
   - Player creates room or joins existing one
   - WebSocket connection established
   - Room state shared with all players

2. **Game Start**
   - Creator starts game when ready (2-4 players)
   - Each player gets a unique 5x5 Bingo board
   - Turn-based system begins

3. **Gameplay**
   - Players take turns marking cells
   - Real-time updates to all players
   - Win detection after each move

4. **Game End**
   - Winner announced to all players
   - Option to play again or leave room

## 🔧 Development

### Available Scripts

```bash
yarn start:dev      # Development with hot reload
yarn start:debug    # Debug mode
yarn build          # Production build
yarn test           # Run tests
yarn test:watch     # Test watch mode
yarn lint           # Code linting
```

---

**Ready to play Bingo? Start the server and let the games begin! 🎯**
