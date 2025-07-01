import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';

@Controller('api/game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('rooms')
  createRoom(@Body() createRoomDto: CreateRoomDto) {
    try {
      const { room, player } = this.gameService.createRoom(createRoomDto);

      return {
        success: true,
        data: {
          roomId: room.id,
          playerId: player.id,
          room: this.formatRoom(room),
          player: this.formatPlayer(player),
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('rooms/join')
  joinRoom(@Body() joinRoomDto: JoinRoomDto) {
    try {
      const result = this.gameService.joinRoom(joinRoomDto);

      if (!result.success || !result.room || !result.player) {
        throw new HttpException(
          {
            success: false,
            error: result.error || 'Failed to join room',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        success: true,
        data: {
          roomId: result.room.id,
          playerId: result.player.id,
          room: this.formatRoom(result.room),
          player: this.formatPlayer(result.player),
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('rooms/:roomId')
  getRoom(@Param('roomId') roomId: string) {
    const room = this.gameService.getRoom(roomId);

    if (!room) {
      throw new HttpException(
        {
          success: false,
          error: 'Room not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      data: {
        room: this.formatRoom(room),
      },
    };
  }

  @Get('rooms')
  getAllRooms() {
    const rooms = this.gameService.getAllRooms();

    return {
      success: true,
      data: {
        rooms: rooms.map((room) => this.formatRoom(room)),
      },
    };
  }

  @Get('health')
  healthCheck() {
    return {
      success: true,
      message: 'Bingo Game Server is running',
      timestamp: new Date().toISOString(),
    };
  }

  // Helper methods
  private formatRoom(room: any) {
    return {
      id: room.id,
      name: room.name,
      creatorId: room.creatorId,
      gameState: room.gameState,
      gameStarted: room.gameStarted,
      currentPlayerIndex: room.currentPlayerIndex,
      maxPlayers: room.maxPlayers,
      playerCount: room.players.size,
      players: Array.from(room.players.values()).map((player) =>
        this.formatPlayer(player),
      ),
      winner: room.winner ? this.formatPlayer(room.winner) : null,
      createdAt: room.createdAt,
    };
  }

  private formatPlayer(player: any) {
    return {
      id: player.id,
      name: player.name,
      isReady: player.isReady,
      bingoCounts: player.bingoCounts,
      // Don't expose board data in HTTP responses for security
      hasBoardGenerated: player.board.length > 0,
    };
  }
}
