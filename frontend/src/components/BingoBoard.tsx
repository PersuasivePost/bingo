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
        <h3 className="text-xl font-bold text-gray-900">{player.name}</h3>
        {isMyTurn && (
          <p className="text-sm text-blue-700 font-bold">Your turn!</p>
        )}
      </div>

      <div className="flex gap-4">
        {/* Bingo Board */}
        <div className="flex-1">
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

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(cellNumber)}
                    disabled={disabled || !isMyTurn || isMarked}
                    className={`
                      aspect-square text-center py-2 px-1 rounded font-semibold text-lg
                      transition-all duration-200 hover:scale-105
                      ${
                        isMarked
                          ? "bg-green-500 text-white cursor-default shadow-lg"
                          : isMyTurn && !disabled
                          ? "bg-white hover:bg-blue-100 cursor-pointer border-2 border-blue-300 text-gray-800"
                          : "bg-white cursor-default border border-gray-300 text-gray-800"
                      }
                    `}
                  >
                    {cellNumber}
                  </button>
                );
              })
            )}
          </div>

          {/* Progress Indicator */}
          <div className="text-center text-sm text-gray-800">
            <p className="font-semibold">Marked: {markedCells.length}/25</p>
          </div>
        </div>

        {/* BINGO Progress on the right */}
        <div className="flex flex-col justify-center items-center ml-4">
          <h4 className="text-lg font-bold text-gray-800 mb-3">BINGO</h4>
          <div className="flex flex-col space-y-2">
            {["B", "I", "N", "G", "O"].map((letter, index) => (
              <div
                key={letter}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                  transition-all duration-300
                  ${
                    index < player.bingoCounts
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
              >
                {letter}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-800 mt-2 font-semibold">
            {player.bingoCounts}/5 Lines
          </p>
        </div>
      </div>
    </div>
  );
};
