'use client';

import { useState, useEffect, useCallback } from 'react';
import TetrisBoard3D from '@/components/TetrisBoard3D';
import TetrisBoard from '@/components/TetrisBoard';
import NextPiecePreview from '@/components/NextPiecePreview';
import { createEmptyGrid, isValidPosition, placePiece, clearLines } from '@/lib/tetris-logic';
import { createRandomPiece, movePiece } from '@/lib/tetris-pieces';
import { rotatePiece } from '@/lib/tetris-logic';
import { Grid, Piece } from '@/lib/tetris-types';

export default function Home() {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lastDroppedPiece, setLastDroppedPiece] = useState<Piece | null>(null);
  const [is3D, setIs3D] = useState(true);
  const [clearedLines, setClearedLines] = useState<number[]>([]);

  const resetGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setCurrentPiece(null);
    setNextPiece(null);
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    setGameOver(false);
    setLastDroppedPiece(null);
    setClearedLines([]);
  }, []);

  const spawnNewPiece = useCallback(() => {
    if (gameOver) return;
    
    const newPiece = nextPiece || createRandomPiece();
    if (isValidPosition(grid, newPiece, newPiece.position)) {
      setCurrentPiece(newPiece);
      setNextPiece(createRandomPiece());
    } else {
      setGameOver(true);
    }
  }, [grid, gameOver, nextPiece]);

  const lockPiece = useCallback(() => {
    if (!currentPiece) return;
    
    // Store the piece that's about to be locked for the drop effect
    setLastDroppedPiece(currentPiece);
    
    const newGrid = placePiece(grid, currentPiece);
    const { newGrid: clearedGrid, linesCleared: cleared, clearedLineIndices } = clearLines(newGrid);
    
    // Show line clear effects if lines were cleared
    if (clearedLineIndices.length > 0) {
      setClearedLines(clearedLineIndices);
      // Clear the effect after animation
      setTimeout(() => setClearedLines([]), 500);
    }
    
    setGrid(clearedGrid);
    setLinesCleared(prev => {
      const newLinesCleared = prev + cleared;
      const newLevel = Math.floor(newLinesCleared / 10) + 1;
      setLevel(newLevel);
      return newLinesCleared;
    });
    setScore(prev => prev + cleared * 100 * level);
    
    // Clear the lastDroppedPiece after a short delay to allow the effect to trigger
    setTimeout(() => {
      setLastDroppedPiece(null);
    }, 100);
    
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
    if (!currentPiece || gameOver) return;

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
  }, [currentPiece, grid, movePieceDown, gameOver]);

  useEffect(() => {
    // Initialize the game once on mount
    if (!nextPiece) {
      setNextPiece(createRandomPiece());
    }
    if (!currentPiece) {
      spawnNewPiece();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array for initialization only

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Game loop - automatic piece dropping
  useEffect(() => {
    if (gameOver) return;
    
    const dropInterval = Math.max(50, 1000 - (level - 1) * 50);
    const gameLoop = setInterval(() => {
      movePieceDown();
    }, dropInterval);

    return () => clearInterval(gameLoop);
  }, [movePieceDown, level, gameOver]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative">
      <div className="flex flex-col items-center gap-6 max-w-6xl w-full">
        <h1 className="text-5xl font-bold text-white mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Tetris
        </h1>
        
        <div className="flex flex-row gap-4 lg:gap-8 items-start w-full justify-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center relative">
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setIs3D(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  !is3D 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                2D View
              </button>
              <button
                onClick={() => setIs3D(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  is3D 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                3D View
              </button>
            </div>
            {is3D ? (
              <TetrisBoard3D 
                grid={grid} 
                currentPiece={currentPiece} 
                lastDroppedPiece={lastDroppedPiece}
              />
            ) : (
              <TetrisBoard 
                grid={grid} 
                currentPiece={currentPiece} 
                lastDroppedPiece={lastDroppedPiece}
                clearedLines={clearedLines}
              />
            )}
            
            {/* Game Over Overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg backdrop-blur-sm">
                <div className="bg-gray-800 border-2 border-red-500 rounded-xl p-6 lg:p-8 text-center shadow-2xl animate-pulse">
                  <h2 className="text-2xl lg:text-3xl font-bold text-red-400 mb-4 lg:mb-6">Game Over!</h2>
                  <div className="text-gray-300 mb-4 lg:mb-6 space-y-1 lg:space-y-2">
                    <p className="text-base lg:text-lg">Final Score: <span className="text-yellow-400 font-bold text-lg lg:text-xl">{score}</span></p>
                    <p className="text-base lg:text-lg">Level Reached: <span className="text-blue-400 font-bold text-lg lg:text-xl">{level}</span></p>
                    <p className="text-base lg:text-lg">Lines Cleared: <span className="text-green-400 font-bold text-lg lg:text-xl">{linesCleared}</span></p>
                  </div>
                  <button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-6 lg:py-3 lg:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-white flex flex-col gap-3 lg:gap-4 min-w-0">
            <div className="bg-gray-700 p-3 lg:p-6 rounded-xl shadow-xl border border-gray-600">
              <h2 className="text-lg lg:text-2xl font-bold mb-3 lg:mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Game Info</h2>
              <div className="space-y-1 lg:space-y-3 text-sm lg:text-lg">
                <p className="flex justify-between">
                  <span>Score:</span> 
                  <span className="font-bold text-yellow-400">{score.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                  <span>Level:</span> 
                  <span className="font-bold text-blue-400">{level}</span>
                </p>
                <p className="flex justify-between">
                  <span>Lines:</span> 
                  <span className="font-bold text-green-400">{linesCleared}</span>
                </p>
              </div>
            </div>
            <NextPiecePreview piece={nextPiece} />
          </div>
        </div>
        
        <div className="text-white text-center mt-4">
          <p className="text-sm md:text-base opacity-80">
            Use <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">↑ ↓ ← →</kbd> to move, 
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs ml-2">Space</kbd> to rotate
          </p>
        </div>
      </div>
    </main>
  );
}
