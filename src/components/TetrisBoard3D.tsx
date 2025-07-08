'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Grid, Piece, CellState } from '@/lib/tetris-types';
import { placePiece } from '@/lib/tetris-logic';
import { createCubeRenderer, CubeRenderer } from '@/lib/cube-renderer';
import { resizeCanvasToDisplaySize, createMatrix4, perspective, translate, multiply } from '@/lib/webgl-utils';

interface TetrisBoard3DProps {
  grid: Grid;
  currentPiece: Piece | null;
  lastDroppedPiece: Piece | null;
}

// Color mapping for 3D rendering
const COLOR_MAP: { [key in CellState]: [number, number, number] } = {
  0: [0.1, 0.1, 0.1], // empty - dark gray
  1: [0.0, 0.8, 1.0], // I piece - cyan
  2: [0.0, 0.0, 1.0], // J piece - blue
  3: [1.0, 0.6, 0.0], // L piece - orange
  4: [1.0, 1.0, 0.0], // O piece - yellow
  5: [0.0, 1.0, 0.0], // S piece - green
  6: [0.5, 0.0, 1.0], // T piece - purple
  7: [1.0, 0.0, 0.0], // Z piece - red
};

export default function TetrisBoard3D({ grid, currentPiece, lastDroppedPiece }: TetrisBoard3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const rendererRef = useRef<CubeRenderer | null>(null);
  const animationRef = useRef<number>();
  const [highlightedPiece, setHighlightedPiece] = useState<Piece | null>(null);

  // Initialize WebGL context and renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;
    rendererRef.current = createCubeRenderer(gl);

    if (!rendererRef.current) {
      console.error('Failed to create cube renderer');
      return;
    }

    // Set up WebGL state
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0.05, 0.05, 0.05, 1.0);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle glow effect for dropped pieces
  useEffect(() => {
    if (lastDroppedPiece) {
      setHighlightedPiece(lastDroppedPiece);
      setTimeout(() => setHighlightedPiece(null), 600);
    }
  }, [lastDroppedPiece]);

  // Check if a position is part of the highlighted piece
  const isPartOfHighlightedPiece = (x: number, y: number): boolean => {
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

  // Render the 3D scene
  const render = () => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    const renderer = rendererRef.current;

    if (!canvas || !gl || !renderer) return;

    // Resize canvas if needed
    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set up camera matrices
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = canvas.width / canvas.height;
    const projectionMatrix = perspective(fieldOfView, aspect, 0.1, 100.0);

    // Create view matrix (camera position)
    let viewMatrix = createMatrix4();
    viewMatrix = translate(viewMatrix, -4.5, -5, -35); // Center camera higher to see bottom wall
    
    // Add slight rotation for better 3D effect
    const rotationY = 0; // Remove left-right movement
    const rotationX = -0.4; // Increase angle to see bottom wall clearly
    
    // Apply rotations (simplified rotation matrices)
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    
    const rotationMatrix = new Float32Array([
      cosY, sinX * sinY, cosX * sinY, 0,
      0, cosX, -sinX, 0,
      -sinY, sinX * cosY, cosX * cosY, 0,
      0, 0, 0, 1
    ]);
    
    viewMatrix = multiply(viewMatrix, rotationMatrix);

    renderer.setProjectionMatrix(projectionMatrix);
    renderer.setViewMatrix(viewMatrix);
    renderer.clear();

    // Get the display grid (current piece overlaid on static grid)
    const displayGrid = currentPiece ? placePiece(grid, currentPiece) : grid;

    // Render the board
    for (let y = 0; y < displayGrid.length; y++) {
      for (let x = 0; x < displayGrid[y].length; x++) {
        const cell = displayGrid[y][x];
        
        if (cell !== 0) {
          const worldX = x;
          const worldY = -y; // Flip Y axis for proper orientation
          const worldZ = 0;
          
          const color = COLOR_MAP[cell];
          const isGlowing = isPartOfHighlightedPiece(x, y);
          
          renderer.render(worldX, worldY, worldZ, color, isGlowing);
        }
      }
    }

    // Render board outline/walls for better depth perception
    const wallColor: [number, number, number] = [0.15, 0.15, 0.25];
    const floorColor: [number, number, number] = [0.1, 0.1, 0.2];
    
    // Left wall
    for (let y = 0; y < 20; y++) {
      renderer.render(-1, -y, 0, wallColor);
    }
    
    // Right wall
    for (let y = 0; y < 20; y++) {
      renderer.render(10, -y, 0, wallColor);
    }
    
    // Bottom wall (at bottom of board)
    for (let x = -1; x <= 10; x++) {
      renderer.render(x, -20, 0, wallColor);
    }
    
    // Add floor grid for better 3D depth perception
    for (let x = 0; x < 10; x++) {
      for (let z = 1; z < 4; z++) {
        renderer.render(x, -20, -z, floorColor);
      }
    }

    // No continuous animation - only render when state changes
  };

  // Start rendering loop
  useEffect(() => {
    if (rendererRef.current) {
      render();
    }
  }, [grid, currentPiece, highlightedPiece]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-[320px] h-[480px] lg:w-[420px] lg:h-[630px] border-2 lg:border-4 border-gray-600 bg-gray-900 rounded-lg shadow-2xl"
        width={420}
        height={630}
      />
    </div>
  );
}