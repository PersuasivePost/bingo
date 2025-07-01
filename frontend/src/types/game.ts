// Game state enums
export enum GameState {
  WAITING = "waiting",
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",
}

// Basic interfaces
export interface Player {
  id: string;
  name: string;
  isReady: boolean;
  bingoCounts: number;
  board: number[]; // Backend sends 1D array
  markedCells: number[]; // Backend sends Array.from(markedCells)
}

export interface Room {
  id: string;
  name: string;
  creatorId: string;
  players: Player[];
  maxPlayers: number;
  gameState: GameState;
  gameStarted: boolean;
  currentPlayerIndex: number;
  calledNumbers: number[];
  winner: Player | null;
}

// Request/Response DTOs
export interface CreateRoomData {
  roomName: string;
  playerName: string;
}

export interface JoinRoomData {
  roomId: string;
  playerName: string;
}

export interface GameMove {
  cellNumber: number;
}

// Socket Event Types
export interface RoomCreatedResponse {
  success: boolean;
  room?: Room;
  player?: Player;
  error?: string;
}

export interface RoomJoinedResponse {
  success: boolean;
  room?: Room;
  player?: Player;
  error?: string;
}

export interface PlayerJoinedEvent {
  player: Player;
  message: string;
}

export interface RoomUpdatedEvent extends Room {
  // The backend sends room data directly, not wrapped in a room property
}

export interface PlayerLeftEvent {
  playerId: string;
  message: string;
}

export interface GameStartedEvent {
  message: string;
}

export interface PlayerMoveEvent {
  playerId: string;
  cellNumber: number;
  bingoAchieved: boolean;
}

export interface MoveSuccessEvent {
  cellNumber: number;
  bingoAchieved: boolean;
}

export interface GameFinishedEvent {
  winner: Player;
}

export interface ErrorEvent {
  message: string;
}
