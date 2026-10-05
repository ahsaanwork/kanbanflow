# Puffy Todos (KanbanFlow)

A full-stack Kanban application built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**.

## 1. Setup Supabase Database

1. Go to your Supabase project dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor** tab from the left sidebar.
3. Open `supabase/schema.sql` from this repository, copy its contents, paste them into the SQL Editor, and click **Run**.
   - This creates the `tasks` table with indexes and Row Level Security (RLS) policies so each user only sees and modifies their own tasks.

## 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. In your Supabase dashboard, go to **Project Settings** -> **API**.
3. Copy your **Project URL** and **Project API Key (`anon` / `public`)**.
4. Set them in your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## 3. Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## 4. Production Build & Deployment

```bash
npm run build
```

The compiled assets will be in `dist/`. You can deploy this folder directly to any static hosting provider (Vercel, Netlify, Cloudflare Pages, Docker, AWS S3/CloudFront, Nginx, etc.).