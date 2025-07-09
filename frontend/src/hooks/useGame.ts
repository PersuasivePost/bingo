"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/contexts/SocketContext";
import {
  Room,
  Player,
  CreateRoomData,
  JoinRoomData,
  GameMove,
  RoomCreatedResponse,
  RoomJoinedResponse,
  PlayerJoinedEvent,
  RoomUpdatedEvent,
  PlayerMoveEvent,
  GameFinishedEvent,
  MoveSuccessEvent,
  ErrorEvent,
  GameState,
  PlayerLeftEvent,
  GameStartedEvent,
} from "@/types/game";

export const useGame = () => {
  const { socket, isConnected } = useSocket();
  const [room, setRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameMessage, setGameMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    // Room events
    const handleRoomCreated = (data: RoomCreatedResponse) => {
      console.log("Room created response received:", data);
      setIsLoading(false);
      if (data.success && data.room && data.player) {
        setRoom(data.room);
        setCurrentPlayer(data.player);
        setGameMessage(`Room "${data.room.name}" created successfully!`);
        setError("");
      } else {
        setError(data.error || "Failed to create room");
      }
    };

    const handleRoomJoined = (data: RoomJoinedResponse) => {
      console.log("Room joined response received:", data);
      setIsLoading(false);
      if (data.success && data.room && data.player) {
        setRoom(data.room);
        setCurrentPlayer(data.player);
        setGameMessage(`Joined room "${data.room.name}" successfully!`);
        setError("");
      } else {
        setError(data.error || "Failed to join room");
      }
    };

    const handlePlayerJoined = (data: PlayerJoinedEvent) => {
      // Only show the message, don't update room state here
      // Room state will be updated by room_updated event
      console.log("Player joined event received:", data);
      setGameMessage(`${data.player.name} joined the room!`);
    };

    const handleRoomUpdated = (data: RoomUpdatedEvent) => {
      // Update room state while preserving current player identity
      console.log("Room updated event received:", data);
      console.log("Current player before update:", currentPlayer);

      // Add null checks - data IS the room data
      if (!data || !data.players) {
        console.error("Invalid room update data:", data);
        return;
      }

      setRoom(data); // data is the room itself

      // Update current player data if it exists in the updated room
      if (currentPlayer && data.players && Array.isArray(data.players)) {
        const updatedCurrentPlayer = data.players.find(
          (player) => player.id === currentPlayer.id
        );
        console.log("Updated current player found:", updatedCurrentPlayer);
        if (updatedCurrentPlayer) {
          setCurrentPlayer(updatedCurrentPlayer);
        } else {
          console.warn("Current player not found in updated room!", {
            currentPlayerId: currentPlayer.id,
            roomPlayers: data.players.map((p) => ({
              id: p.id,
              name: p.name,
            })),
          });
        }
      }
    };

    const handlePlayerLeft = (data: PlayerLeftEvent) => {
      setGameMessage(data.message || "A player left the room");
      // Room update will come separately via room_updated event
    };

    const handleGameStarted = (data: GameStartedEvent) => {
      setGameMessage(data.message || "Game started! Good luck!");
      // Room update will come separately via room_updated event
    };

    const handlePlayerMove = (data: PlayerMoveEvent) => {
      // Room update will come separately via room_updated event
      if (data.playerId !== currentPlayer?.id) {
        setGameMessage(`Player marked ${data.cellNumber}`);
      }
      if (data.bingoAchieved) {
        setGameMessage("A player achieved BINGO!");
      }
    };

    const handleMoveSuccess = (data: MoveSuccessEvent) => {
      // Room update will come separately via room_updated event
      setGameMessage(`You marked ${data.cellNumber}`);
      if (data.bingoAchieved) {
        setGameMessage("🎉 You achieved BINGO!");
      }
    };

    const handleGameFinished = (data: GameFinishedEvent) => {
      // Room update will come separately via room_updated event
      if (data.winner.id === currentPlayer?.id) {
        setGameMessage("🎉 Congratulations! You won!");
      } else {
        setGameMessage(`🏆 ${data.winner.name} won the game!`);
      }
    };

    const handleError = (data: ErrorEvent) => {
      setError(data.message);
      setIsLoading(false);
    };

    // Register event listeners
    socket.on("room_created", handleRoomCreated);
    socket.on("room_joined", handleRoomJoined);
    socket.on("player_joined", handlePlayerJoined);
    socket.on("room_updated", handleRoomUpdated);
    socket.on("player_left", handlePlayerLeft);
    socket.on("game_started", handleGameStarted);
    socket.on("player_move", handlePlayerMove);
    socket.on("move_success", handleMoveSuccess);
    socket.on("game_finished", handleGameFinished);
    socket.on("error", handleError);

    // Add debugging for all socket events
    socket.onAny((event, ...args) => {
      console.log("Socket event received:", event, args);
    });

    return () => {
      socket.off("room_created", handleRoomCreated);
      socket.off("room_joined", handleRoomJoined);
      socket.off("player_joined", handlePlayerJoined);
      socket.off("room_updated", handleRoomUpdated);
      socket.off("player_left", handlePlayerLeft);
      socket.off("game_started", handleGameStarted);
      socket.off("player_move", handlePlayerMove);
      socket.off("move_success", handleMoveSuccess);
      socket.off("game_finished", handleGameFinished);
      socket.off("error", handleError);
      socket.offAny();
    };
  }, [socket, currentPlayer]);

  // Actions
  const createRoom = useCallback(
    async (data: CreateRoomData) => {
      if (!socket || !isConnected) {
        setError("Not connected to server");
        return;
      }
      setIsLoading(true);
      setError("");
      console.log("Creating room with data:", data);
      console.log("Socket connected:", isConnected);
      console.log("Socket instance:", socket?.connected);

      // Add timeout to prevent infinite loading and fallback to REST API
      const timeout = setTimeout(async () => {
        console.log(
          "WebSocket room creation timed out, trying REST API fallback"
        );
        try {
          const backendUrl =
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
          const response = await fetch(`${backendUrl}/api/game/rooms`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();
          console.log("REST API response:", result);

          if (result.success && result.data) {
            setRoom(result.data.room);
            setCurrentPlayer(result.data.player);
            setGameMessage(
              `Room "${result.data.room.name}" created successfully!`
            );
            setError("");
          } else {
            setError(result.error || "Failed to create room via REST API");
          }
        } catch (err) {
          setError("Failed to create room - connection error");
          console.error("REST API error:", err);
        }
        setIsLoading(false);
      }, 3000); // 3 second timeout

      // Store timeout to clear it if response comes
      const handleRoomCreated = (responseData: any) => {
        console.log("WebSocket room created response:", responseData);
        clearTimeout(timeout);
        setIsLoading(false);
      };

      socket.once("room_created", handleRoomCreated);

      socket.emit("create_room", data);
    },
    [socket, isConnected]
  );

  const joinRoom = useCallback(
    async (data: JoinRoomData) => {
      if (!socket || !isConnected) {
        // If socket is not connected, try REST API directly
        console.log("Socket not connected, trying REST API for join room");
        try {
          const backendUrl =
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
          const response = await fetch(`${backendUrl}/api/game/rooms/join`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();
          console.log("Join room REST API response:", result);

          if (result.success && result.data) {
            setRoom(result.data.room);
            setCurrentPlayer(result.data.player);
            setGameMessage(
              `Joined room "${result.data.room.name}" successfully!`
            );
            setError("");
          } else {
            setError(result.error || "Failed to join room via REST API");
          }
        } catch (err) {
          setError("Failed to join room - connection error");
          console.error("Join room REST API error:", err);
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      // Add timeout for WebSocket join room
      const timeout = setTimeout(async () => {
        console.log("WebSocket join room timed out, trying REST API fallback");
        try {
          const backendUrl =
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
          const response = await fetch(`${backendUrl}/api/game/rooms/join`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();
          console.log("Join room REST API response:", result);

          if (result.success && result.data) {
            setRoom(result.data.room);
            setCurrentPlayer(result.data.player);
            setGameMessage(
              `Joined room "${result.data.room.name}" successfully!`
            );
            setError("");
          } else {
            setError(result.error || "Failed to join room via REST API");
          }
        } catch (err) {
          setError("Failed to join room - connection error");
          console.error("Join room REST API error:", err);
        }
        setIsLoading(false);
      }, 3000); // 3 second timeout

      // Store timeout to clear it if response comes
      const handleRoomJoined = (responseData: any) => {
        console.log("WebSocket room joined response:", responseData);
        clearTimeout(timeout);
        setIsLoading(false);
      };

      socket.once("room_joined", handleRoomJoined);
      socket.emit("join_room", data);
    },
    [socket, isConnected]
  );

  const leaveRoom = useCallback(() => {
    if (!socket || !room) return;
    socket.emit("leave_room", { roomId: room.id });
    setRoom(null);
    setCurrentPlayer(null);
    setGameMessage("");
    setError("");
  }, [socket, room]);

  const startGame = useCallback(() => {
    if (!socket || !room) return;
    socket.emit("start_game", { roomId: room.id });
  }, [socket, room]);

  const makeMove = useCallback(
    (cellNumber: number) => {
      if (!socket || !room || !currentPlayer) return;
      socket.emit("make_move", { cellNumber });
    },
    [socket, room, currentPlayer]
  );

  const resetGame = useCallback(() => {
    if (!socket || !room) return;
    socket.emit("reset_game", { roomId: room.id });
  }, [socket, room]);

  // Helper functions
  const isCurrentPlayerTurn = useCallback(() => {
    if (!room || !currentPlayer || room.gameState !== GameState.IN_PROGRESS)
      return false;
    return room.players[room.currentPlayerIndex]?.id === currentPlayer.id;
  }, [room, currentPlayer]);

  const isRoomCreator = useCallback(() => {
    return currentPlayer?.id === room?.creatorId;
  }, [currentPlayer, room]);

  const canStartGame = useCallback(() => {
    return (
      isRoomCreator() && room && room.players.length >= 2 && !room.gameStarted
    );
  }, [isRoomCreator, room]);

  const clearMessages = useCallback(() => {
    setGameMessage("");
    setError("");
  }, []);

  return {
    // State
    room,
    currentPlayer,
    gameMessage,
    error,
    isLoading,
    isConnected,

    // Actions
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    makeMove,
    resetGame,

    // Helpers
    isCurrentPlayerTurn,
    isRoomCreator,
    canStartGame,
    clearMessages,
  };
};
