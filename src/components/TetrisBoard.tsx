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
    <div className="grid grid-cols-10 gap-0 border-2 lg:border-4 border-gray-600 bg-gray-900 p-2 lg:p-3 rounded-lg shadow-2xl">
      {displayGrid.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`w-5 h-5 lg:w-7 lg:h-7 border border-gray-600 ${COLORS[cell]} transition-all duration-150 ${
              cell !== 0 ? 'shadow-sm' : ''
            }`}
            style={{
              boxShadow: cell !== 0 ? 'inset 0 1px 2px rgba(255,255,255,0.1)' : undefined
            }}
          />
        ))
      )}
    </div>
  );
}