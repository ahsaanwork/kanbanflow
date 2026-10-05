-- KanbanFlow Supabase Schema & Row Level Security (RLS)

-- 1. Create Tasks Table
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  description text default '',
  stage text not null check (stage in ('backlog', 'todo', 'in_progress', 'done')) default 'backlog',
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  due_date date,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast user queries & sorting
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_stage_idx on public.tasks(stage);

-- 2. Enable Row Level Security (RLS)
alter table public.tasks enable row level security;

-- 3. RLS Policies (Users can only see and modify their own tasks)
drop policy if exists "Users can view their own tasks" on public.tasks;
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own tasks" on public.tasks;
create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own tasks" on public.tasks;
create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own tasks" on public.tasks;
create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);
