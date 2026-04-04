# CLAUDE.md - Project Guide for AI Agents

## Project Overview
Browser-based RPG/adventure game with market mechanics, character progression, combat, and daily rewards.

## Tech Stack
- **Frontend:** React 19 + Vite 7 (JSX, no TypeScript)
- **Backend:** Node.js + Express 5
- **Database:** PostgreSQL (via `pg` driver)
- **Auth:** bcryptjs for password hashing
- **Deployment:** Vercel (serverless functions in `api/`)

## Directory Structure
- `src/components/screens/` - Game screens (35+ components for different game states)
- `src/components/` - UI panels (CharacterDock, RightPanel, SidePanel)
- `src/engine/` - Core game logic (combat, loot, scaling, skills, stat calculations)
- `src/data/` - Game data and configuration (items, enemies, classes, etc.)
- `src/hooks/` - Custom React hooks
- `src/api.js` - API client for frontend-to-backend communication
- `server/` - Express backend (index.js, db.js)
- `server/routes/` - API routes (auth, save, invites, daily rewards, trades, market, probability)
- `api/` - Vercel serverless function wrappers

## Key Commands
- `npm run dev` - Start Vite dev server (frontend)
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `node server/index.js` - Start backend server

## Architecture Notes
- Game state is managed in React (App.jsx is the main orchestrator)
- The `engine/` directory contains pure game logic separate from UI
- Backend routes handle persistence, auth, and multiplayer features (trading, market)
- No TypeScript - all files are .js/.jsx
- No test framework currently configured

## Subdirectory Docs
- `src/engine/CLAUDE.md` - Game engine: formulas, damage stacking, skill effect patterns, file dependencies
- `server/CLAUDE.md` - Full database schema (SQL), all API endpoints, auth flow, transaction patterns

## Keeping Docs Updated
When you modify files in `src/engine/` or `server/`, update the corresponding `CLAUDE.md` to reflect your changes. This includes:
- New or removed files, functions, or endpoints
- Changed formulas, constants, or scaling values
- New database tables or columns
- New API routes or changed request/response shapes
