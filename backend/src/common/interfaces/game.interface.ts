export interface Player {
  id: string;
  name: string;
  socketId: string;
  isReady: boolean;
  board: number[];
  markedCells: Set<number>;
  bingoCounts: number;
}

export interface Room {
  id: string;
  name: string;
  creatorId: string;
  players: Map<string, Player>;
  gameState: GameState;
  currentPlayerIndex: number;
  gameStarted: boolean;
  maxPlayers: number;
  createdAt: Date;
  winner?: Player;
}

export enum GameState {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

export interface GameResult {
  winnerId: string;
  winnerName: string;
  gameStats: {
    totalMoves: number;
    gameDuration: number;
  };
}

export interface BingoBoard {
  numbers: number[];
  markedCells: Set<number>;
}

export interface GameMove {
  playerId: string;
  cellNumber: number;
  isWinningMove: boolean;
  bingoAchieved: boolean;
}
