# AGENTS.md

## Project Context

This is a Vite + React application using Supabase for authentication and PostgreSQL data storage. It runs completely independently on user-managed infrastructure.

## Key Files & Structure

- `src/`: Frontend React application source.
- `src/api/supabaseClient.js`: Supabase JavaScript client instance.
- `src/lib/AuthContext.jsx`: Authentication context powered by Supabase Auth (`onAuthStateChange`, sessions).
- `src/pages/Home.jsx`: Kanban board with CRUD operations for tasks against the `tasks` table.
- `supabase/schema.sql`: PostgreSQL table definitions and Row Level Security (RLS) policies.
- `vite.config.js`: Clean Vite configuration with `@` alias to `./src`.
- `.env`: Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## Development

- Start local dev server: `npm run dev`
- Production build: `npm run build`
