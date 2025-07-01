"use client";

import React from "react";
import { Player } from "@/types/game";

interface BingoBoardProps {
  player: Player;
  isMyTurn: boolean;
  onCellClick: (cellNumber: number) => void;
  disabled: boolean;
}

export const BingoBoard: React.FC<BingoBoardProps> = ({
  player,
  isMyTurn,
  onCellClick,
  disabled,
}) => {
  // Safety checks
  if (!player || !player.board || !Array.isArray(player.board)) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-center text-red-500">
          Error: Invalid player data
        </div>
      </div>
    );
  }

  if (player.board.length !== 25) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-center text-red-500">
          Error: Invalid board size (expected 25 cells, got{" "}
          {player.board.length})
        </div>
      </div>
    );
  }

  // Convert 1D array to 2D for display
  const convertTo2D = (board: number[]) => {
    const result = [];
    for (let i = 0; i < 5; i++) {
      result.push(board.slice(i * 5, (i + 1) * 5));
    }
    return result;
  };

  const board2D = convertTo2D(player.board);
  const markedCells = player.markedCells || [];

  const handleCellClick = (cellNumber: number) => {
    if (disabled || !isMyTurn) return;
    if (markedCells.includes(cellNumber)) return; // Already marked

    onCellClick(cellNumber);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Player Info */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">{player.name}</h3>
        {isMyTurn && (
          <p className="text-sm text-blue-600 font-semibold">Your turn!</p>
        )}
      </div>

      {/* Bingo Board */}
      <div className="grid grid-cols-5 gap-1 mb-4">
        {/* Header Row */}
        {["B", "I", "N", "G", "O"].map((letter) => (
          <div
            key={letter}
            className="bg-blue-600 text-white text-center py-2 font-bold text-lg rounded"
          >
            {letter}
          </div>
        ))}

        {/* Board Cells */}
        {board2D.map((row, rowIndex) =>
          row.map((cellNumber, colIndex) => {
            const isMarked = markedCells.includes(cellNumber);
            const isFreeSpace = rowIndex === 2 && colIndex === 2; // Center cell

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(cellNumber)}
                disabled={disabled || !isMyTurn || isMarked || isFreeSpace}
                className={`
                  aspect-square text-center py-2 px-1 rounded font-semibold text-sm
                  transition-all duration-200 hover:scale-105
                  ${
                    isFreeSpace
                      ? "bg-yellow-400 text-yellow-800 cursor-default"
                      : isMarked || isFreeSpace
                      ? "bg-green-500 text-white cursor-default"
                      : isMyTurn && !disabled
                      ? "bg-gray-100 hover:bg-blue-100 cursor-pointer border-2 border-blue-300"
                      : "bg-gray-100 cursor-default"
                  }
                `}
              >
                {isFreeSpace ? "FREE" : cellNumber}
              </button>
            );
          })
        )}
      </div>

      {/* Progress Indicator */}
      <div className="text-center text-xs text-gray-600">
        <p>Marked: {markedCells.length}/24</p>
        <p className="text-blue-600 font-semibold">
          Bingo Lines: {player.bingoCounts}
        </p>
      </div>
    </div>
  );
};
