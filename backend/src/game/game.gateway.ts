import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, ValidationPipe, UsePipes } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { GameActionDto } from './dto/game-action.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(GameGateway.name);

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Clean up any rooms the player was in
    const cleanup = this.gameService.cleanupDisconnectedPlayer(client.id);
    if (cleanup.success && cleanup.roomId) {
      // Notify remaining players in the room
      this.emitToRoom(cleanup.roomId, 'player_left', {
        message: 'A player has left the game',
      });
      this.emitRoomUpdate(cleanup.roomId);
    }
  }

  @SubscribeMessage('create_room')
  @UsePipes(new ValidationPipe())
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() createRoomDto: CreateRoomDto,
  ) {
    try {
      const { room, player } = this.gameService.createRoom(createRoomDto);

      // Update player socket ID
      this.gameService.updatePlayerSocket(player.id, client.id);

      // Join socket room
      client.join(room.id);

      // Store player info in socket
      client.data.playerId = player.id;
      client.data.roomId = room.id;

      client.emit('room_created', {
        success: true,
        room: this.formatRoomForClient(room),
        player: this.formatPlayerForClient(player),
      });

      this.logger.log(`Room ${room.id} created by ${createRoomDto.playerName}`);
    } catch (error) {
      client.emit('room_created', {
        success: false,
        error: error.message,
      });
    }
  }

  @SubscribeMessage('join_room')
  @UsePipes(new ValidationPipe())
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() joinRoomDto: JoinRoomDto,
  ) {
    try {
      const result = this.gameService.joinRoom(joinRoomDto);

      if (!result.success || !result.room || !result.player) {
        client.emit('room_joined', {
          success: false,
          error: result.error || 'Failed to join room',
        });
        return;
      }

      // Update player socket ID
      this.gameService.updatePlayerSocket(result.player.id, client.id);

      // Join socket room
      client.join(result.room.id);

      // Store player info in socket
      client.data.playerId = result.player.id;
      client.data.roomId = result.room.id;

      client.emit('room_joined', {
        success: true,
        room: this.formatRoomForClient(result.room),
        player: this.formatPlayerForClient(result.player),
      });

      // Notify other players
      client.to(result.room.id).emit('player_joined', {
        player: this.formatPlayerForClient(result.player),
        message: `${result.player.name} joined the room`,
      });

      // Send updated room state to all players
      this.emitRoomUpdate(result.room.id);

      this.logger.log(
        `Player ${joinRoomDto.playerName} joined room ${joinRoomDto.roomId}`,
      );
    } catch (error) {
      client.emit('room_joined', {
        success: false,
        error: error.message,
      });
    }
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(@ConnectedSocket() client: Socket) {
    const playerId = client.data.playerId;
    const roomId = client.data.roomId;

    if (!playerId) {
      return;
    }

    const result = this.gameService.leaveRoom(playerId);

    if (result.success) {
      client.leave(roomId);
      client.data.playerId = null;
      client.data.roomId = null;

      client.emit('room_left', { success: true });

      // Notify remaining players
      if (roomId) {
        this.emitToRoom(roomId, 'player_left', {
          playerId,
          message: 'A player has left the room',
        });
        this.emitRoomUpdate(roomId);
      }
    }
  }

  @SubscribeMessage('start_game')
  async handleStartGame(@ConnectedSocket() client: Socket) {
    const playerId = client.data.playerId;
    const roomId = client.data.roomId;

    if (!playerId || !roomId) {
      client.emit('game_start_failed', { error: 'Invalid player or room' });
      return;
    }

    const result = this.gameService.startGame(roomId, playerId);

    if (result.success) {
      this.emitToRoom(roomId, 'game_started', {
        message: 'Game has started!',
      });
      this.emitRoomUpdate(roomId);
    } else {
      client.emit('game_start_failed', { error: result.error });
    }
  }

  @SubscribeMessage('make_move')
  @UsePipes(new ValidationPipe())
  async handleMakeMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameActionDto: GameActionDto,
  ) {
    try {
      const playerId = client.data.playerId;
      const roomId = client.data.roomId;

      if (!playerId || !roomId) {
        client.emit('move_failed', { error: 'Invalid player or room' });
        return;
      }

      const result = this.gameService.makeMove(
        roomId,
        playerId,
        gameActionDto.cellNumber,
      );

      if (!result.success) {
        client.emit('move_failed', { error: result.error });
        return;
      }

      // Emit move success to the player
      client.emit('move_success', {
        cellNumber: gameActionDto.cellNumber,
        bingoAchieved: result.bingoAchieved,
      });

      // Emit move to all players in room
      this.emitToRoom(roomId, 'player_move', {
        playerId: playerId,
        cellNumber: gameActionDto.cellNumber,
        bingoAchieved: result.bingoAchieved,
      });

      // Check if game is won
      if (result.gameResult) {
        this.emitToRoom(roomId, 'game_finished', {
          winner: result.gameResult,
        });
      }

      // Send updated room state
      this.emitRoomUpdate(roomId);
    } catch (error) {
      client.emit('move_failed', { error: error.message });
    }
  }

  @SubscribeMessage('reset_game')
  async handleResetGame(@ConnectedSocket() client: Socket) {
    const playerId = client.data.playerId;
    const roomId = client.data.roomId;

    if (!playerId || !roomId) {
      return;
    }

    const room = this.gameService.getRoom(roomId);
    if (!room || room.creatorId !== playerId) {
      client.emit('reset_failed', {
        error: 'Only room creator can reset the game',
      });
      return;
    }

    const result = this.gameService.resetGame(roomId);

    if (result.success) {
      this.emitToRoom(roomId, 'game_reset', {
        message: 'Game has been reset',
      });
      this.emitRoomUpdate(roomId);
    } else {
      client.emit('reset_failed', { error: result.error });
    }
  }

  @SubscribeMessage('get_room_state')
  async handleGetRoomState(@ConnectedSocket() client: Socket) {
    const roomId = client.data.roomId;

    if (roomId) {
      this.emitRoomUpdate(roomId, client.id);
    }
  }

  // Helper methods
  private emitToRoom(roomId: string, event: string, data: any) {
    this.server.to(roomId).emit(event, data);
  }

  private emitRoomUpdate(roomId: string, targetSocketId?: string) {
    const room = this.gameService.getRoom(roomId);
    if (!room) return;

    const roomData = this.formatRoomForClient(room);

    if (targetSocketId) {
      this.server.to(targetSocketId).emit('room_updated', roomData);
    } else {
      this.emitToRoom(roomId, 'room_updated', roomData);
    }
  }

  private formatRoomForClient(room: any) {
    return {
      id: room.id,
      name: room.name,
      creatorId: room.creatorId,
      gameState: room.gameState,
      gameStarted: room.gameStarted,
      currentPlayerIndex: room.currentPlayerIndex,
      maxPlayers: room.maxPlayers,
      players: Array.from(room.players.values()).map((player) =>
        this.formatPlayerForClient(player),
      ),
      winner: room.winner ? this.formatPlayerForClient(room.winner) : null,
    };
  }

  private formatPlayerForClient(player: any) {
    return {
      id: player.id,
      name: player.name,
      isReady: player.isReady,
      bingoCounts: player.bingoCounts,
      board: player.board,
      markedCells: Array.from(player.markedCells),
    };
  }
}
