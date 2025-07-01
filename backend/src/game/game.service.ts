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

    const board = this.bingoEngine.generateBoard();
    const markedCells = new Set<number>();

    const player: Player = {
      id: playerId,
      name: createRoomDto.playerName,
      socketId: '',
      isReady: false,
      board: board,
      markedCells: markedCells,
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
      winner: undefined,
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

    const board = this.bingoEngine.generateBoard();
    const markedCells = new Set<number>();

    const player: Player = {
      id: playerId,
      name: joinRoomDto.playerName,
      socketId: '',
      isReady: false,
      board: board,
      markedCells: markedCells,
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
   * Make a move in the game - marks the called number on ALL players' boards
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
    winnerPlayer?: Player;
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

    // Check if the current player has this number on their board
    if (!player.board.includes(cellNumber)) {
      return { success: false, error: 'Number not on your board' };
    }

    // Check if this number was already called
    if (player.markedCells.has(cellNumber)) {
      return { success: false, error: 'Number already called' };
    }

    // Mark this number on ALL players' boards (if they have it)
    let bingoAchieved = false;
    let winnerPlayer: Player | null = null;

    room.players.forEach((p) => {
      if (p.board.includes(cellNumber)) {
        p.markedCells.add(cellNumber);

        // Check for bingo for this player
        const { hasBingo, totalBingos } = this.bingoEngine.checkForBingo(
          p.markedCells,
          p.board,
        );

        if (hasBingo && totalBingos > p.bingoCounts) {
          p.bingoCounts = totalBingos;
          bingoAchieved = true;

          // Check for game win (5 bingos = winner)
          if (totalBingos >= 5 && !winnerPlayer) {
            winnerPlayer = p;
          }
        }
      }
    });

    // If someone won, end the game
    if (winnerPlayer !== null) {
      room.gameState = GameState.FINISHED;
      room.winner = winnerPlayer; // Set the winner on the room

      const winner = winnerPlayer as Player;

      const gameResult: GameResult = {
        winnerId: winner.id,
        winnerName: winner.name,
        gameStats: {
          totalMoves: Array.from(winner.markedCells).length,
          gameDuration: Date.now() - room.createdAt.getTime(),
        },
      };

      this.logger.log(`Game won by ${winner.name} in room ${roomId}`);

      return { success: true, gameResult, bingoAchieved, winnerPlayer: winner };
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

    // Reset all players with new boards
    room.players.forEach((player) => {
      const newBoard = this.bingoEngine.generateBoard();
      player.board = newBoard;
      player.markedCells = new Set<number>();
      player.bingoCounts = 0;
      player.isReady = false;
    });

    room.gameStarted = false;
    room.gameState = GameState.WAITING;
    room.currentPlayerIndex = 0;
    room.winner = undefined; // Clear the winner field

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
