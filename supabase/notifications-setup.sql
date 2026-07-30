-- Run this once in the Supabase SQL Editor before using web push in production.
-- It stores only browser push endpoints; no customer data is stored here.

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  subscription jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

-- Admin users can register their own device, while the Edge Function reads and
-- removes subscriptions using the Supabase service-role key.
drop policy if exists "Authenticated users can create push subscriptions" on public.push_subscriptions;
create policy "Authenticated users can create push subscriptions"
  on public.push_subscriptions for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update push subscriptions" on public.push_subscriptions;
create policy "Authenticated users can update push subscriptions"
  on public.push_subscriptions for update to authenticated using (true) with check (true);

create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  target_tab text not null default 'enquiries',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.admin_notifications enable row level security;

-- Public forms can create alerts, but only authenticated admin sessions can
-- view, mark read, or clear the notification centre.
drop policy if exists "Public users can create admin notifications" on public.admin_notifications;
create policy "Public users can create admin notifications"
  on public.admin_notifications for insert to anon, authenticated with check (true);

drop policy if exists "Authenticated users can read admin notifications" on public.admin_notifications;
create policy "Authenticated users can read admin notifications"
  on public.admin_notifications for select to authenticated using (true);

drop policy if exists "Authenticated users can update admin notifications" on public.admin_notifications;
create policy "Authenticated users can update admin notifications"
  on public.admin_notifications for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can delete admin notifications" on public.admin_notifications;
create policy "Authenticated users can delete admin notifications"
  on public.admin_notifications for delete to authenticated using (true);

create table if not exists public.page_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  page_path text not null,
  created_at timestamptz not null default now()
);

alter table public.page_visits enable row level security;

drop policy if exists "Public users can record page visits" on public.page_visits;
create policy "Public users can record page visits"
  on public.page_visits for insert to anon, authenticated with check (true);

drop policy if exists "Authenticated users can read page visits" on public.page_visits;
create policy "Authenticated users can read page visits"
  on public.page_visits for select to authenticated using (true);

-- The dashboard relies on these table events for its in-app/browser alert while
-- it is open. This block safely skips tables already in the publication.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['enquiries', 'contact_submissions', 'call_requests', 'warranty_claims']
  loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = table_name
    ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end $$;
