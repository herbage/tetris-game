'use client';

import React from 'react';
import { Grid, Piece, COLORS } from '@/lib/tetris-types';
import { placePiece } from '@/lib/tetris-logic';

interface TetrisBoardProps {
  grid: Grid;
  currentPiece: Piece | null;
}

export default function TetrisBoard({ grid, currentPiece }: TetrisBoardProps) {
  const displayGrid = currentPiece ? placePiece(grid, currentPiece) : grid;
  
  return (
    <div className="grid grid-cols-10 gap-0 border-2 border-gray-600 bg-gray-900 p-2">
      {displayGrid.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`w-6 h-6 border border-gray-700 ${COLORS[cell]}`}
          />
        ))
      )}
    </div>
  );
}