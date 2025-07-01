export class ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;

  constructor(success: boolean, data?: T, error?: string, message?: string) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.message = message;
  }

  static success<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse(true, data, undefined, message);
  }

  static error(error: string): ApiResponse<null> {
    return new ApiResponse(false, null, error);
  }
}

export class GameConstants {
  static readonly MIN_PLAYERS = 2;
  static readonly MAX_PLAYERS = 4;
  static readonly BOARD_SIZE = 25;
  static readonly WINNING_BINGOS = 5;
  static readonly ROOM_NAME_MAX_LENGTH = 50;
  static readonly PLAYER_NAME_MAX_LENGTH = 30;
}

export class GameEvents {
  // Client to Server events
  static readonly CREATE_ROOM = 'create_room';
  static readonly JOIN_ROOM = 'join_room';
  static readonly LEAVE_ROOM = 'leave_room';
  static readonly START_GAME = 'start_game';
  static readonly MAKE_MOVE = 'make_move';
  static readonly RESET_GAME = 'reset_game';
  static readonly GET_ROOM_STATE = 'get_room_state';

  // Server to Client events
  static readonly ROOM_CREATED = 'room_created';
  static readonly ROOM_JOINED = 'room_joined';
  static readonly ROOM_LEFT = 'room_left';
  static readonly PLAYER_JOINED = 'player_joined';
  static readonly PLAYER_LEFT = 'player_left';
  static readonly GAME_STARTED = 'game_started';
  static readonly GAME_FINISHED = 'game_finished';
  static readonly GAME_RESET = 'game_reset';
  static readonly PLAYER_MOVE = 'player_move';
  static readonly ROOM_UPDATED = 'room_updated';
  static readonly MOVE_SUCCESS = 'move_success';
  static readonly MOVE_FAILED = 'move_failed';
  static readonly GAME_START_FAILED = 'game_start_failed';
  static readonly RESET_FAILED = 'reset_failed';
}
