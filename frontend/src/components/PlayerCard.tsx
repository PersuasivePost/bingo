"use client";

import React from "react";
import { Player } from "@/types/game";

interface PlayerCardProps {
  player: Player;
  isCurrentTurn: boolean;
  isCurrentPlayer: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isCurrentTurn,
  isCurrentPlayer,
}) => {
  // Calculate BINGO progress
  const getBingoLetters = (bingoCount: number) => {
    const letters = ["B", "I", "N", "G", "O"];
    return letters.slice(0, bingoCount);
  };

  const bingoLetters = getBingoLetters(player.bingoCounts);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Player Info */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          {player.name}
          {isCurrentPlayer && (
            <span className="ml-2 text-blue-500 text-sm">(You)</span>
          )}
        </h3>
        {isCurrentTurn && (
          <p className="text-sm text-green-600 font-semibold">Current Turn</p>
        )}
      </div>

      {/* BINGO Progress */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">
          BINGO Progress
        </h4>
        <div className="flex justify-center space-x-2">
          {["B", "I", "N", "G", "O"].map((letter, index) => (
            <div
              key={letter}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${
                  bingoLetters.includes(letter)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }
              `}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="text-center text-xs text-gray-600">
        <p>Marked Cells: {player.markedCells.length}/24</p>
        <p>Lines Completed: {player.bingoCounts}/5</p>
      </div>
    </div>
  );
};
