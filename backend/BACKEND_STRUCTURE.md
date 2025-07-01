# Backend File Structure

```
backend/
├── src/
│   ├── app.module.ts                 # Main app module
│   ├── main.ts                       # Application entry point
│   │
│   ├── common/                       # Shared utilities
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── guards/                   # Guards for validation
│   │   ├── interceptors/             # Request/Response interceptors
│   │   └── utils/                    # Utility functions
│   │
│   ├── game/                         # Game logic module
│   │   ├── dto/
│   │   │   ├── create-room.dto.ts
│   │   │   ├── join-room.dto.ts
│   │   │   └── game-action.dto.ts
│   │   ├── entities/
│   │   │   ├── game.entity.ts
│   │   │   ├── player.entity.ts
│   │   │   └── room.entity.ts
│   │   ├── game.gateway.ts           # WebSocket gateway
│   │   ├── game.service.ts           # Game business logic
│   │   ├── game.controller.ts        # HTTP endpoints
│   │   └── game.module.ts
│   │
│   ├── room/                         # Room management
│   │   ├── dto/
│   │   ├── room.service.ts
│   │   ├── room.controller.ts
│   │   └── room.module.ts
│   │
│   ├── player/                       # Player management
│   │   ├── dto/
│   │   ├── player.service.ts
│   │   ├── player.controller.ts
│   │   └── player.module.ts
│   │
│   └── bingo/                        # Bingo game engine
│       ├── bingo-engine.service.ts   # Core bingo logic
│       ├── bingo-board.service.ts    # Board generation & management
│       └── bingo.module.ts
│
├── test/                             # E2E tests
├── package.json
├── tsconfig.json
├── nest-cli.json
└── yarn.lock
```

## Key Features:

- **WebSocket Gateway** for real-time communication
- **Room Management** for creating/joining rooms
- **Game Engine** with your existing bingo logic
- **Player Management** without authentication
- **Modular Architecture** for scalability
- **Production Ready** structure for Docker/K8s
