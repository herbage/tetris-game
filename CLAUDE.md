# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current Status

This is a **fully functional** Tetris web application built with Next.js 15, TypeScript, and Tailwind CSS. The game is complete with all core features implemented, including **3D WebGL visualization**.

**Completed Features:**
- ✅ Next.js project setup with TypeScript and Tailwind CSS
- ✅ Core Tetris game logic (grid, pieces, rotation, line clearing)
- ✅ Tetris piece shapes and movement system (all 7 piece types)
- ✅ Game board UI component with grid rendering
- ✅ **3D WebGL board rendering with cube visualization**
- ✅ **Toggle between 2D and 3D view modes**
- ✅ Keyboard controls (arrow keys for movement, spacebar for rotation)
- ✅ Complete game state management (score, level, lines cleared)
- ✅ Automatic game loop with increasing difficulty by level
- ✅ Next piece preview with clean centered display
- ✅ Game over detection and restart functionality
- ✅ Responsive design optimized for desktop and mobile
- ✅ Visual drop effects with subtle piece glow animation
- ✅ Polished UI with gradient backgrounds and modern styling
- ✅ **3D walls and floor grid for depth perception**

**Current Controls:**
- Arrow Left/Right: Move piece horizontally
- Arrow Down: Move piece down faster
- Spacebar: Rotate piece
- **2D/3D View buttons: Toggle between 2D flat view and 3D WebGL view**

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
- **`webgl-utils.ts` - WebGL matrix operations and utility functions**
- **`cube-renderer.ts` - 3D cube rendering system with WebGL shaders**

**Components (`src/components/`):**
- `TetrisBoard.tsx` - Renders the 2D game board with current piece overlay and drop effects
- **`TetrisBoard3D.tsx` - Renders the 3D WebGL game board with cube visualization**
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
- **3D WebGL visualization with cube-based pieces**
- **Interactive 2D/3D view toggle**
- **3D board walls and floor grid for depth perception**
- **Optimized 3D camera positioning showing full board**

**Controls:**
- Arrow keys for movement (left/right/down)
- Spacebar for piece rotation
- **2D/3D View toggle buttons**
- Game over screen with restart button

## 3D WebGL Implementation

**3D Rendering System:**
- Custom WebGL shaders for cube rendering
- Matrix transformations for 3D perspective
- Optimized camera positioning to show full board
- Color-coded pieces matching 2D version
- Static camera with no movement/swaying
- Proper depth testing and face culling
- 3D walls and floor grid for spatial reference

**3D Features:**
- All 7 Tetris piece types rendered as 3D cubes
- Piece drop glow effects in 3D
- Seamless toggle between 2D and 3D views
- Maintained 2D gameplay logic with 3D visuals
- Responsive 3D canvas sizing

## Potential Future Enhancements

**Optional Features (if requested):**
- Sound effects and background music
- High score persistence
- Multiple difficulty modes
- Hold piece functionality
- Hard drop feature
- Ghost piece preview
- Line clear animations
- **3D camera rotation controls**
- **Enhanced 3D lighting effects**
- **Particle effects for line clearing**