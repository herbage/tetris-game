import { Piece, CellState, BOARD_WIDTH } from './tetris-types';

export const PIECE_SHAPES = {
  I: [
    [1, 1, 1, 1]
  ],
  O: [
    [2, 2],
    [2, 2]
  ],
  T: [
    [0, 3, 0],
    [3, 3, 3]
  ],
  S: [
    [0, 4, 4],
    [4, 4, 0]
  ],
  Z: [
    [5, 5, 0],
    [0, 5, 5]
  ],
  J: [
    [6, 0, 0],
    [6, 6, 6]
  ],
  L: [
    [0, 0, 7],
    [7, 7, 7]
  ]
};

export const PIECE_COLORS: { [key: string]: CellState } = {
  I: 1,
  O: 2,
  T: 3,
  S: 4,
  Z: 5,
  J: 6,
  L: 7
};

export function createRandomPiece(): Piece {
  const pieces = Object.keys(PIECE_SHAPES);
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  const shape = PIECE_SHAPES[randomPiece as keyof typeof PIECE_SHAPES];
  const color = PIECE_COLORS[randomPiece];
  
  return {
    shape,
    color,
    position: {
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2),
      y: 0
    }
  };
}

export function movePiece(piece: Piece, dx: number, dy: number): Piece {
  return {
    ...piece,
    position: {
      x: piece.position.x + dx,
      y: piece.position.y + dy
    }
  };
}