import { Grid, Piece, Position, BOARD_WIDTH, BOARD_HEIGHT } from './tetris-types';

export function createEmptyGrid(): Grid {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
}

export function isValidPosition(grid: Grid, piece: Piece, position: Position): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const newX = position.x + x;
        const newY = position.y + y;
        
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }
        
        if (newY >= 0 && grid[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
}

export function placePiece(grid: Grid, piece: Piece): Grid {
  const newGrid = grid.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const gridY = piece.position.y + y;
        const gridX = piece.position.x + x;
        if (gridY >= 0 && gridY < BOARD_HEIGHT && gridX >= 0 && gridX < BOARD_WIDTH) {
          newGrid[gridY][gridX] = piece.color;
        }
      }
    }
  }
  
  return newGrid;
}

export function clearLines(grid: Grid): { newGrid: Grid; linesCleared: number; clearedLineIndices: number[] } {
  const clearedLineIndices: number[] = [];
  const newGrid = grid.filter((row, index) => {
    const shouldClear = row.every(cell => cell !== 0);
    if (shouldClear) {
      clearedLineIndices.push(index);
    }
    return !shouldClear;
  });
  
  const linesCleared = BOARD_HEIGHT - newGrid.length;
  
  while (newGrid.length < BOARD_HEIGHT) {
    newGrid.unshift(Array(BOARD_WIDTH).fill(0));
  }
  
  return { newGrid, linesCleared, clearedLineIndices };
}

export function rotatePiece(piece: Piece): Piece {
  const rotated = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
  
  return {
    ...piece,
    shape: rotated,
  };
}