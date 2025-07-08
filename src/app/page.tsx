'use client';

import { useState, useEffect, useCallback } from 'react';
import TetrisBoard from '@/components/TetrisBoard';
import { createEmptyGrid, isValidPosition, placePiece, clearLines } from '@/lib/tetris-logic';
import { createRandomPiece, movePiece } from '@/lib/tetris-pieces';
import { rotatePiece } from '@/lib/tetris-logic';
import { Grid, Piece } from '@/lib/tetris-types';

export default function Home() {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);

  const spawnNewPiece = useCallback(() => {
    setCurrentPiece(createRandomPiece());
  }, []);

  const lockPiece = useCallback(() => {
    if (!currentPiece) return;
    
    const newGrid = placePiece(grid, currentPiece);
    const { newGrid: clearedGrid, linesCleared: cleared } = clearLines(newGrid);
    
    setGrid(clearedGrid);
    setLinesCleared(prev => {
      const newLinesCleared = prev + cleared;
      const newLevel = Math.floor(newLinesCleared / 10) + 1;
      setLevel(newLevel);
      return newLinesCleared;
    });
    setScore(prev => prev + cleared * 100 * level);
    spawnNewPiece();
  }, [currentPiece, grid, level, spawnNewPiece]);

  const movePieceDown = useCallback(() => {
    if (!currentPiece) return;
    
    const movedPiece = movePiece(currentPiece, 0, 1);
    if (isValidPosition(grid, movedPiece, movedPiece.position)) {
      setCurrentPiece(movedPiece);
    } else {
      lockPiece();
    }
  }, [currentPiece, grid, lockPiece]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!currentPiece) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        const leftMove = movePiece(currentPiece, -1, 0);
        if (isValidPosition(grid, leftMove, leftMove.position)) {
          setCurrentPiece(leftMove);
        }
        break;
      
      case 'ArrowRight':
        event.preventDefault();
        const rightMove = movePiece(currentPiece, 1, 0);
        if (isValidPosition(grid, rightMove, rightMove.position)) {
          setCurrentPiece(rightMove);
        }
        break;
      
      case 'ArrowDown':
        event.preventDefault();
        movePieceDown();
        break;
      
      case ' ':
        event.preventDefault();
        const rotated = rotatePiece(currentPiece);
        if (isValidPosition(grid, rotated, rotated.position)) {
          setCurrentPiece(rotated);
        }
        break;
    }
  }, [currentPiece, grid, movePieceDown]);

  useEffect(() => {
    spawnNewPiece();
  }, [spawnNewPiece]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Game loop - automatic piece dropping
  useEffect(() => {
    const dropInterval = Math.max(50, 1000 - (level - 1) * 50);
    const gameLoop = setInterval(() => {
      movePieceDown();
    }, dropInterval);

    return () => clearInterval(gameLoop);
  }, [movePieceDown, level]);

  return (
    <main className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-white mb-6">Tetris</h1>
        
        <div className="flex gap-8">
          <div className="flex flex-col items-center">
            <TetrisBoard grid={grid} currentPiece={currentPiece} />
          </div>
          
          <div className="text-white">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Game Info</h2>
              <p>Score: {score}</p>
              <p>Level: {level}</p>
              <p>Lines: {linesCleared}</p>
            </div>
          </div>
        </div>
        
        <div className="text-white text-center">
          <p className="text-sm">Use arrow keys to move, space to rotate</p>
        </div>
      </div>
    </main>
  );
}
