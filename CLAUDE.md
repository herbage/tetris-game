# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current Status

This is a **fully functional** Tetris web application built with Next.js 15, TypeScript, and Tailwind CSS. The game is complete with all core features implemented.

**Completed Features:**
- ✅ Next.js project setup with TypeScript and Tailwind CSS
- ✅ Core Tetris game logic (grid, pieces, rotation, line clearing)
- ✅ Tetris piece shapes and movement system (all 7 piece types)
- ✅ Game board UI component with grid rendering
- ✅ Keyboard controls (arrow keys for movement, spacebar for rotation)
- ✅ Complete game state management (score, level, lines cleared)
- ✅ Automatic game loop with increasing difficulty by level
- ✅ Next piece preview with clean centered display
- ✅ Game over detection and restart functionality
- ✅ Responsive design optimized for desktop and mobile
- ✅ Visual drop effects with subtle piece glow animation
- ✅ Polished UI with gradient backgrounds and modern styling

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
- `TetrisBoard.tsx` - Renders the game board with current piece overlay and drop effects
- `NextPiecePreview.tsx` - Displays the next piece with clean centered layout

**Main Application (`src/app/`):**
- `page.tsx` - Main game component with complete state management and keyboard controls
- `globals.css` - Global styles including drop effect animations

## Game Features

**Core Gameplay:**
- Complete Tetris mechanics with all 7 piece types (I, O, T, S, Z, J, L)
- Automatic piece dropping with speed increase per level
- Line clearing with proper scoring system
- Level progression every 10 lines cleared
- Game over detection when pieces reach the top

**Visual Features:**
- Responsive design that works on desktop and mobile
- Modern gradient UI with polished styling
- Subtle glow effect when pieces land
- Clean next piece preview without visual gaps
- Smooth animations and transitions

**Controls:**
- Arrow keys for movement (left/right/down)
- Spacebar for piece rotation
- Game over screen with restart button

## Potential Future Enhancements

**Optional Features (if requested):**
- Sound effects and background music
- High score persistence
- Multiple difficulty modes
- Hold piece functionality
- Hard drop feature
- Ghost piece preview
- Line clear animations