import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  Room,
  Player,
  GameState,
  GameResult,
} from '../common/interfaces/game.interface';
import { BingoEngineService } from '../bingo/bingo-engine.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private rooms = new Map<string, Room>();
  private playerToRoom = new Map<string, string>();

  constructor(private readonly bingoEngine: BingoEngineService) {}

  /**
   * Create a new game room
   */
  createRoom(createRoomDto: CreateRoomDto): {
    room: Room;
    player: Player;
  } {
    const roomId = uuidv4();
    const playerId = uuidv4();

    const player: Player = {
      id: playerId,
      name: createRoomDto.playerName,
      socketId: '',
      isReady: false,
      board: this.bingoEngine.generateBoard(),
      markedCells: new Set<number>(),
      bingoCounts: 0,
    };

    const room: Room = {
      id: roomId,
      name: createRoomDto.roomName,
      creatorId: playerId,
      players: new Map([[playerId, player]]),
      gameState: GameState.WAITING,
      currentPlayerIndex: 0,
      gameStarted: false,
      maxPlayers: 4,
      createdAt: new Date(),
    };

    this.rooms.set(roomId, room);
    this.playerToRoom.set(playerId, roomId);

    this.logger.log(`Room created: ${roomId} by ${createRoomDto.playerName}`);

    return { room, player };
  }

  /**
   * Join an existing room
   */
  joinRoom(joinRoomDto: JoinRoomDto): {
    success: boolean;
    room?: Room;
    player?: Player;
    error?: string;
  } {
    const room = this.rooms.get(joinRoomDto.roomId);

    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.gameStarted) {
      return { success: false, error: 'Game already started' };
    }

    if (room.players.size >= room.maxPlayers) {
      return { success: false, error: 'Room is full' };
    }

    // Check if player name is already taken in this room
    const existingPlayer = Array.from(room.players.values()).find(
      (p) => p.name === joinRoomDto.playerName,
    );

    if (existingPlayer) {
      return { success: false, error: 'Player name already taken' };
    }

    const playerId = uuidv4();
    const player: Player = {
      id: playerId,
      name: joinRoomDto.playerName,
      socketId: '',
      isReady: false,
      board: this.bingoEngine.generateBoard(),
      markedCells: new Set<number>(),
      bingoCounts: 0,
    };

    room.players.set(playerId, player);
    this.playerToRoom.set(playerId, room.id);

    this.logger.log(`Player ${joinRoomDto.playerName} joined room ${room.id}`);

    return { success: true, room, player };
  }

  /**
   * Remove player from room
   */
  leaveRoom(playerId: string): {
    success: boolean;
    roomId?: string;
    wasCreator?: boolean;
  } {
    const roomId = this.playerToRoom.get(playerId);
    if (!roomId) {
      return { success: false };
    }

    const room = this.rooms.get(roomId);
    if (!room) {
      return { success: false };
    }

    const wasCreator = room.creatorId === playerId;
    room.players.delete(playerId);
    this.playerToRoom.delete(playerId);

    // If creator left or room is empty, delete room
    if (wasCreator || room.players.size === 0) {
      this.rooms.delete(roomId);
      // Clean up all remaining players
      room.players.forEach((_, pid) => {
        this.playerToRoom.delete(pid);
      });
      this.logger.log(`Room ${roomId} deleted`);
    } else {
      // Assign new creator
      const newCreator = Array.from(room.players.values())[0];
      room.creatorId = newCreator.id;
      this.logger.log(
        `New creator assigned: ${newCreator.name} for room ${roomId}`,
      );
    }

    return { success: true, roomId, wasCreator };
  }

  /**
   * Start the game
   */
  startGame(
    roomId: string,
    creatorId: string,
  ): {
    success: boolean;
    error?: string;
  } {
    const room = this.rooms.get(roomId);

    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.creatorId !== creatorId) {
      return { success: false, error: 'Only room creator can start the game' };
    }

    if (room.players.size < 2) {
      return {
        success: false,
        error: 'At least 2 players required to start the game',
      };
    }

    if (room.gameStarted) {
      return { success: false, error: 'Game already started' };
    }

    room.gameStarted = true;
    room.gameState = GameState.IN_PROGRESS;
    room.currentPlayerIndex = 0;

    this.logger.log(`Game started in room ${roomId}`);

    return { success: true };
  }

  /**
   * Make a move in the game
   */
  makeMove(
    roomId: string,
    playerId: string,
    cellNumber: number,
  ): {
    success: boolean;
    error?: string;
    gameResult?: GameResult;
    bingoAchieved?: boolean;
  } {
    const room = this.rooms.get(roomId);

    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (!room.gameStarted || room.gameState !== GameState.IN_PROGRESS) {
      return { success: false, error: 'Game not in progress' };
    }

    const player = room.players.get(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    // Check if it's player's turn
    const players = Array.from(room.players.values());
    const currentPlayer = players[room.currentPlayerIndex];

    if (currentPlayer.id !== playerId) {
      return { success: false, error: 'Not your turn' };
    }

    // Make the move
    const { isValid, cellIndex } = this.bingoEngine.markCell(
      player.board,
      player.markedCells,
      cellNumber,
    );

    if (!isValid) {
      return { success: false, error: 'Invalid move' };
    }

    // Check for bingo
    const { hasBingo, totalBingos } = this.bingoEngine.checkForBingo(
      player.markedCells,
    );

    let bingoAchieved = false;
    if (hasBingo && totalBingos > player.bingoCounts) {
      player.bingoCounts = totalBingos;
      bingoAchieved = true;
    }

    // Check for game win
    if (this.bingoEngine.hasWon(player.markedCells)) {
      room.gameState = GameState.FINISHED;

      const gameResult: GameResult = {
        winnerId: player.id,
        winnerName: player.name,
        gameStats: {
          totalMoves: Array.from(player.markedCells).length,
          gameDuration: Date.now() - room.createdAt.getTime(),
        },
      };

      this.logger.log(`Game won by ${player.name} in room ${roomId}`);

      return { success: true, gameResult, bingoAchieved };
    }

    // Move to next player
    room.currentPlayerIndex = (room.currentPlayerIndex + 1) % players.length;

    return { success: true, bingoAchieved };
  }

  /**
   * Reset game in room (for new game)
   */
  resetGame(roomId: string): { success: boolean; error?: string } {
    const room = this.rooms.get(roomId);

    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    // Reset all players
    room.players.forEach((player) => {
      player.board = this.bingoEngine.generateBoard();
      player.markedCells = new Set<number>();
      player.bingoCounts = 0;
      player.isReady = false;
    });

    room.gameStarted = false;
    room.gameState = GameState.WAITING;
    room.currentPlayerIndex = 0;

    this.logger.log(`Game reset in room ${roomId}`);

    return { success: true };
  }

  /**
   * Get room by ID
   */
  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * Get player's room ID
   */
  getPlayerRoom(playerId: string): string | undefined {
    return this.playerToRoom.get(playerId);
  }

  /**
   * Update player socket ID
   */
  updatePlayerSocket(playerId: string, socketId: string): boolean {
    const roomId = this.playerToRoom.get(playerId);
    if (!roomId) return false;

    const room = this.rooms.get(roomId);
    if (!room) return false;

    const player = room.players.get(playerId);
    if (!player) return false;

    player.socketId = socketId;
    return true;
  }

  /**
   * Get all active rooms (for admin/monitoring)
   */
  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Clean up disconnected players
   */
  cleanupDisconnectedPlayer(socketId: string): {
    success: boolean;
    roomId?: string;
  } {
    for (const [roomId, room] of this.rooms) {
      for (const [playerId, player] of room.players) {
        if (player.socketId === socketId) {
          this.leaveRoom(playerId);
          return { success: true, roomId };
        }
      }
    }
    return { success: false };
  }
}
