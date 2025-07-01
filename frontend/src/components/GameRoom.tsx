"use client";

import React, { useState } from "react";
import { Room, Player, GameState } from "@/types/game";
import { BingoBoard } from "./BingoBoard";
import { PlayerCard } from "./PlayerCard";

interface GameRoomProps {
  room: Room;
  currentPlayer: Player;
  isCurrentPlayerTurn: boolean;
  isRoomCreator: boolean;
  canStartGame: boolean;
  onMakeMove: (cellNumber: number) => void;
  onStartGame: () => void;
  onResetGame: () => void;
  onLeaveRoom: () => void;
}

export const GameRoom: React.FC<GameRoomProps> = ({
  room,
  currentPlayer,
  isCurrentPlayerTurn,
  isRoomCreator,
  canStartGame,
  onMakeMove,
  onStartGame,
  onResetGame,
  onLeaveRoom,
}) => {
  const [copyMessage, setCopyMessage] = useState<string>("");

  const currentTurnPlayer = room.gameStarted
    ? room.players[room.currentPlayerIndex]
    : null;

  const copyRoomId = async (roomId: string) => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopyMessage("Room ID copied!");
      setTimeout(() => setCopyMessage(""), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = roomId;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopyMessage("Room ID copied!");
        setTimeout(() => setCopyMessage(""), 2000);
      } catch (fallbackErr) {
        setCopyMessage("Failed to copy");
        setTimeout(() => setCopyMessage(""), 2000);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Room Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{room.name}</h1>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span title={`Full Room ID: ${room.id}`} className="cursor-help">
              Room ID: {room.id.slice(0, 8)}...
            </span>
            <button
              onClick={() => copyRoomId(room.id)}
              className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-semibold transition-colors"
              title="Copy full room ID"
            >
              📋 Copy
            </button>
          </div>
          <span>
            Players: {room.players.length}/{room.maxPlayers}
          </span>
          <span
            className={`px-2 py-1 rounded ${
              room.gameState === GameState.WAITING
                ? "bg-yellow-100 text-yellow-800"
                : room.gameState === GameState.IN_PROGRESS
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {room.gameState === GameState.WAITING
              ? "Waiting"
              : room.gameState === GameState.IN_PROGRESS
              ? "In Progress"
              : "Finished"}
          </span>
        </div>

        {/* Copy confirmation message */}
        {copyMessage && (
          <div className="mt-2 text-sm text-green-600 font-semibold">
            {copyMessage}
          </div>
        )}
      </div>

      {/* Game Status */}
      {room.gameState === GameState.FINISHED && room.winner && (
        <div className="text-center mb-6 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-yellow-800 mb-3">
            🏆 GAME OVER! 🏆
          </h2>
          <p className="text-2xl font-bold text-orange-800 mb-2">
            🎉 {room.winner.name} WON THE GAME! 🎉
          </p>
          <p className="text-lg font-semibold text-yellow-700">
            Congratulations on completing BINGO!
          </p>
        </div>
      )}

      {room.gameStarted &&
        currentTurnPlayer &&
        room.gameState === GameState.IN_PROGRESS && (
          <div className="text-center mb-4">
            <p className="text-lg font-semibold text-blue-600">
              {isCurrentPlayerTurn
                ? "It's your turn!"
                : `Waiting for ${currentTurnPlayer.name}...`}
            </p>
          </div>
        )}

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        {canStartGame && (
          <button
            onClick={onStartGame}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Start Game
          </button>
        )}

        {isRoomCreator && room.gameState === GameState.FINISHED && (
          <button
            onClick={onResetGame}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            New Game
          </button>
        )}

        <button
          onClick={onLeaveRoom}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Leave Room
        </button>
      </div>

      {/* Players List for Waiting State */}
      {!room.gameStarted && (
        <div className="space-y-6">
          {/* Share Room Section */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold mb-3 text-center text-blue-800">
              📤 Invite Friends to Join
            </h3>
            <div className="bg-white rounded-lg p-4 border border-blue-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Room ID:
                  </label>
                  <div className="font-mono text-lg text-gray-800 bg-gray-50 px-3 py-2 rounded border">
                    {room.id}
                  </div>
                </div>
                <button
                  onClick={() => copyRoomId(room.id)}
                  className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  📋 Copy ID
                </button>
              </div>
              <div className="mt-3 text-sm text-gray-800 font-medium">
                Share this Room ID with friends so they can join your game!
              </div>
            </div>
          </div>

          {/* Players List */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3 text-center text-gray-800">
              Players in Room
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {room.players.map((player) => (
                <div
                  key={player.id}
                  className={`p-3 rounded-lg text-center ${
                    player.id === currentPlayer.id
                      ? "bg-blue-100 border-2 border-blue-300"
                      : "bg-white"
                  }`}
                >
                  <div className="font-bold text-gray-800">{player.name}</div>
                  {player.id === room.creatorId && (
                    <div className="text-xs text-blue-700 mt-1 font-semibold">
                      Room Creator
                    </div>
                  )}
                  {player.id === currentPlayer.id && (
                    <div className="text-xs text-green-700 mt-1 font-semibold">
                      You
                    </div>
                  )}
                </div>
              ))}

              {/* Empty slots */}
              {Array.from(
                { length: room.maxPlayers - room.players.length },
                (_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="p-3 rounded-lg text-center bg-gray-100 border-2 border-dashed border-gray-300"
                  >
                    <div className="text-gray-600 font-medium">
                      Waiting for player...
                    </div>
                  </div>
                )
              )}
            </div>

            {room.players.length < 2 && (
              <div className="text-center mt-4 text-orange-700 font-semibold">
                Minimum 2 players required to start the game
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Boards */}
      {room.gameStarted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Player's Board - Full Size */}
          <div className="lg:col-span-2">
            <BingoBoard
              player={currentPlayer}
              isMyTurn={isCurrentPlayerTurn}
              onCellClick={onMakeMove}
              disabled={false}
            />
          </div>

          {/* Other Players - Compact Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Other Players
            </h3>
            {room.players
              .filter((player) => player.id !== currentPlayer.id)
              .map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isCurrentTurn={
                    room.players[room.currentPlayerIndex]?.id === player.id
                  }
                  isCurrentPlayer={false}
                />
              ))}

            {/* Show current turn indicator */}
            {currentTurnPlayer && (
              <div className="text-center p-3 bg-blue-100 rounded-lg border border-blue-300">
                <p className="text-base font-bold text-blue-800">
                  {currentTurnPlayer.id === currentPlayer.id
                    ? "🎯 Your Turn!"
                    : `⏳ ${currentTurnPlayer.name}'s Turn`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!room.gameStarted && (
        <div className="text-center text-gray-800 text-base mt-6">
          <p className="font-semibold">
            Share the room ID with friends to invite them to play!
          </p>
          {isRoomCreator && room.players.length >= 2 && (
            <p className="font-bold text-green-700 mt-2 text-lg">
              You can start the game when ready!
            </p>
          )}
        </div>
      )}
    </div>
  );
};
