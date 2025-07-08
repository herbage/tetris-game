'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Piece, COLORS } from '@/lib/tetris-types';
import { placePiece } from '@/lib/tetris-logic';

interface TetrisBoardProps {
  grid: Grid;
  currentPiece: Piece | null;
  lastDroppedPiece: Piece | null;
}

export default function TetrisBoard({ grid, currentPiece, lastDroppedPiece }: TetrisBoardProps) {
  const displayGrid = currentPiece ? placePiece(grid, currentPiece) : grid;
  const [highlightedPiece, setHighlightedPiece] = useState<Piece | null>(null);

  // Create glow effect when piece lands
  const createGlowEffect = (piece: Piece) => {
    setHighlightedPiece(piece);
    
    // Clear highlighted piece after glow animation
    setTimeout(() => setHighlightedPiece(null), 600);
  };

  // Trigger glow effect when lastDroppedPiece changes
  useEffect(() => {
    if (lastDroppedPiece) {
      createGlowEffect(lastDroppedPiece);
    }
  }, [lastDroppedPiece]);


  const isPartOfHighlightedPiece = (x: number, y: number) => {
    if (!highlightedPiece) return false;
    
    for (let pieceY = 0; pieceY < highlightedPiece.shape.length; pieceY++) {
      for (let pieceX = 0; pieceX < highlightedPiece.shape[pieceY].length; pieceX++) {
        if (highlightedPiece.shape[pieceY][pieceX] !== 0) {
          const gridX = highlightedPiece.position.x + pieceX;
          const gridY = highlightedPiece.position.y + pieceY;
          if (gridX === x && gridY === y) return true;
        }
      }
    }
    return false;
  };
  
  return (
    <div className="relative">
      <div className="grid grid-cols-10 gap-0 border-2 lg:border-4 border-gray-600 bg-gray-900 p-2 lg:p-3 rounded-lg shadow-2xl">
        {displayGrid.map((row, y) =>
          row.map((cell, x) => {
            const isGlowing = isPartOfHighlightedPiece(x, y);
            
            return (
              <div
                key={`${y}-${x}`}
                className={`w-5 h-5 lg:w-7 lg:h-7 border border-gray-600 ${COLORS[cell]} transition-all duration-150 ${
                  cell !== 0 ? 'shadow-sm' : ''
                } ${isGlowing ? 'animate-glow' : ''}`}
                style={{
                  boxShadow: cell !== 0 ? 'inset 0 1px 2px rgba(255,255,255,0.1)' : undefined
                }}
              />
            );
          })
        )}
      </div>
      
    </div>
  );
}