"use client";

import React from "react";
import { HomePage } from "@/components/HomePage";
import { GameRoom } from "@/components/GameRoom";
import { Notification } from "@/components/Notification";
import { useGame } from "@/hooks/useGame";
import { useSocket } from "@/contexts/SocketContext";

export default function Home() {
  const { isConnected } = useSocket();
  const {
    room,
    currentPlayer,
    gameMessage,
    error,
    isLoading,
    createRoom,
    joinRoom,
    makeMove,
    startGame,
    resetGame,
    leaveRoom,
    isCurrentPlayerTurn,
    isRoomCreator,
    canStartGame,
  } = useGame();

  // If not in a room, show the home page
  if (!room || !currentPlayer) {
    return (
      <div>
        <HomePage
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          isLoading={isLoading}
          isConnected={isConnected}
        />
        {(gameMessage || error) && (
          <Notification
            message={gameMessage || error}
            type={error ? "error" : "success"}
            onClose={() => {}}
          />
        )}
      </div>
    );
  }

  // If in a room, show the game room
  return (
    <div>
      <GameRoom
        room={room}
        currentPlayer={currentPlayer}
        isCurrentPlayerTurn={isCurrentPlayerTurn()}
        isRoomCreator={isRoomCreator()}
        canStartGame={canStartGame() || false}
        onMakeMove={makeMove}
        onStartGame={startGame}
        onResetGame={resetGame}
        onLeaveRoom={leaveRoom}
      />
      {(gameMessage || error) && (
        <Notification
          message={gameMessage || error}
          type={error ? "error" : "success"}
          onClose={() => {}}
        />
      )}
    </div>
  );
}
