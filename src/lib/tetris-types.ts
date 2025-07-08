export type CellState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Grid = CellState[][];
export type Position = { x: number; y: number };

export interface Piece {
  shape: number[][];
  color: CellState;
  position: Position;
}

export interface GameState {
  grid: Grid;
  currentPiece: Piece | null;
  score: number;
  level: number;
  linesCleared: number;
  gameOver: boolean;
  paused: boolean;
}

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const COLORS = {
  0: 'bg-gray-900', // empty
  1: 'bg-cyan-400', // I piece
  2: 'bg-blue-500', // J piece
  3: 'bg-orange-500', // L piece
  4: 'bg-yellow-400', // O piece
  5: 'bg-green-400', // S piece
  6: 'bg-purple-500', // T piece
  7: 'bg-red-500', // Z piece
};