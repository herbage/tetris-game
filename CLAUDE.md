# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current Status

This is a Tetris web application built with Next.js 15, TypeScript, and Tailwind CSS. The project has basic Tetris gameplay functionality implemented.

**Completed Features:**
- ✅ Next.js project setup with TypeScript and Tailwind CSS
- ✅ Core Tetris game logic (grid, pieces, rotation, line clearing)
- ✅ Tetris piece shapes and movement system (all 7 piece types)
- ✅ Game board UI component with grid rendering
- ✅ Keyboard controls (arrow keys for movement, spacebar for rotation)
- ✅ Basic game state management (score, level, lines cleared)

**Current Controls:**
- Arrow Left/Right: Move piece horizontally
- Arrow Down: Move piece down faster
- Spacebar: Rotate piece

## Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

**Core Game Logic (`src/lib/`):**
- `tetris-types.ts` - Type definitions for game state, pieces, and grid
- `tetris-logic.ts` - Core game mechanics (grid operations, collision detection, line clearing)
- `tetris-pieces.ts` - Piece shapes, colors, and movement functions

**Components (`src/components/`):**
- `TetrisBoard.tsx` - Renders the game board with current piece overlay

**Main Application (`src/app/`):**
- `page.tsx` - Main game component with state management and keyboard controls

## Next Steps

The following features are planned but not yet implemented:
- Game loop with automatic piece dropping
- Game over detection and restart functionality
- Next piece preview
- Improved styling and animations
- Level progression with increasing difficulty