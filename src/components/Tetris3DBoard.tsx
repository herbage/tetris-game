'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import { Grid, Piece, CellState } from '@/lib/tetris-types';
import { placePiece } from '@/lib/tetris-logic';
import * as THREE from 'three';

interface Tetris3DBoardProps {
  grid: Grid;
  currentPiece: Piece | null;
  lastDroppedPiece: Piece | null;
}

const PIECE_COLORS = {
  0: '#111827', // empty - dark gray
  1: '#06B6D4', // I piece - cyan
  2: '#3B82F6', // J piece - blue
  3: '#F97316', // L piece - orange
  4: '#FCD34D', // O piece - yellow
  5: '#10B981', // S piece - green
  6: '#8B5CF6', // T piece - purple
  7: '#EF4444', // Z piece - red
};

function Block({ 
  position, 
  color, 
  isGlowing = false 
}: { 
  position: [number, number, number]; 
  color: string; 
  isGlowing?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  const material = useMemo(() => {
    const baseColor = new THREE.Color(color);
    return new THREE.MeshPhongMaterial({
      color: baseColor,
      shininess: 100,
      specular: isGlowing ? 0x444444 : 0x222222,
      emissive: isGlowing ? baseColor.clone().multiplyScalar(0.1) : new THREE.Color(0x000000),
    });
  }, [color, isGlowing]);

  return (
    <Box
      ref={meshRef}
      position={position}
      args={[0.9, 0.9, 0.9]}
      material={material}
      castShadow
      receiveShadow
    />
  );
}

function GameBoard({ grid, currentPiece, lastDroppedPiece }: Tetris3DBoardProps) {
  const displayGrid = currentPiece ? placePiece(grid, currentPiece) : grid;
  
  const isPartOfDroppedPiece = (x: number, y: number) => {
    if (!lastDroppedPiece) return false;
    
    for (let pieceY = 0; pieceY < lastDroppedPiece.shape.length; pieceY++) {
      for (let pieceX = 0; pieceX < lastDroppedPiece.shape[pieceY].length; pieceX++) {
        if (lastDroppedPiece.shape[pieceY][pieceX] !== 0) {
          const gridX = lastDroppedPiece.position.x + pieceX;
          const gridY = lastDroppedPiece.position.y + pieceY;
          if (gridX === x && gridY === y) return true;
        }
      }
    }
    return false;
  };

  const blocks = [];
  
  // Add board outline
  for (let x = -1; x <= 10; x++) {
    for (let z = -1; z <= 20; z++) {
      if (x === -1 || x === 10 || z === -1 || z === 20) {
        blocks.push(
          <Block
            key={`border-${x}-${z}`}
            position={[x, -0.5, z]}
            color="#4B5563"
          />
        );
      }
    }
  }
  
  // Add game pieces
  for (let y = 0; y < displayGrid.length; y++) {
    for (let x = 0; x < displayGrid[y].length; x++) {
      const cell = displayGrid[y][x];
      if (cell !== 0) {
        const isGlowing = isPartOfDroppedPiece(x, y);
        blocks.push(
          <Block
            key={`${x}-${y}`}
            position={[x, 0, y]}
            color={PIECE_COLORS[cell as CellState]}
            isGlowing={isGlowing}
          />
        );
      }
    }
  }
  
  return <>{blocks}</>;
}

export default function Tetris3DBoard({ grid, currentPiece, lastDroppedPiece }: Tetris3DBoardProps) {
  return (
    <div className="w-full h-[500px] lg:h-[600px] rounded-lg overflow-hidden border-2 border-gray-600 bg-gray-900">
      <Canvas
        camera={{ 
          position: [15, 15, 15], 
          fov: 50 
        }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <pointLight position={[5, 10, 5]} intensity={0.3} />
        
        <GameBoard 
          grid={grid} 
          currentPiece={currentPiece} 
          lastDroppedPiece={lastDroppedPiece}
        />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={30}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}