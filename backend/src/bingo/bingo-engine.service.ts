import { Injectable } from '@nestjs/common';
import { BingoBoard } from '../common/interfaces/game.interface';

@Injectable()
export class BingoEngineService {
  private readonly WINNING_POSITIONS = [
    // Horizontal lines
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    // Vertical lines
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    // Diagonal lines
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  /**
   * Generate a shuffled bingo board with numbers 1-25
   */
  generateBoard(): number[] {
    // Create array [1, 2, 3, ..., 25]
    let array = Array.from({ length: 25 }, (_, i) => i + 1);
    return this.shuffleArray(array);
  }

  /**
   * Fisher-Yates shuffle algorithm (same as your existing logic)
   */
  private shuffleArray(array: number[]): number[] {
    let currentIndex = array.length;
    let randomIndex: number;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  /**
   * Check if a board has any bingo (winning line)
   */
  checkForBingo(markedCells: Set<number>): {
    hasBingo: boolean;
    newBingos: number[];
    totalBingos: number;
  } {
    const newBingos: number[] = [];
    let totalBingos = 0;

    this.WINNING_POSITIONS.forEach((combination, index) => {
      const isComplete = combination.every((position) =>
        markedCells.has(position),
      );

      if (isComplete) {
        newBingos.push(index);
        totalBingos++;
      }
    });

    return {
      hasBingo: newBingos.length > 0,
      newBingos,
      totalBingos,
    };
  }

  /**
   * Mark a cell on the board and return if it was a valid move
   */
  markCell(
    board: number[],
    markedCells: Set<number>,
    cellNumber: number,
  ): { isValid: boolean; cellIndex: number } {
    const cellIndex = board.findIndex((num) => num === cellNumber);

    if (cellIndex === -1 || markedCells.has(cellIndex)) {
      return { isValid: false, cellIndex: -1 };
    }

    markedCells.add(cellIndex);
    return { isValid: true, cellIndex };
  }

  /**
   * Check if a player has won (5 bingos = game winner)
   */
  hasWon(markedCells: Set<number>): boolean {
    const { totalBingos } = this.checkForBingo(markedCells);
    return totalBingos >= 5;
  }

  /**
   * Get all winning combinations for a board
   */
  getWinningCombinations(): number[][] {
    return [...this.WINNING_POSITIONS];
  }

  /**
   * Create a new bingo board instance
   */
  createBingoBoard(): BingoBoard {
    return {
      numbers: this.generateBoard(),
      markedCells: new Set<number>(),
    };
  }

  /**
   * Get board state for client
   */
  getBoardState(board: number[], markedCells: Set<number>) {
    return {
      numbers: board,
      markedCells: Array.from(markedCells),
      bingoStatus: this.checkForBingo(markedCells),
    };
  }
}
