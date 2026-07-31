-- Run once in the Supabase SQL Editor before production deployment.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "Admins can view their own admin record" on public.admin_users;
create policy "Admins can view their own admin record" on public.admin_users for select to authenticated using (user_id = auth.uid());

-- Make the existing owner an admin. Change the email before executing if needed.
insert into public.admin_users (user_id)
select id from auth.users where lower(email) = 'admin@tytandoor.com'
on conflict do nothing;

-- Replace broad notification policies with role-based policies.
drop policy if exists "Authenticated users can read admin notifications" on public.admin_notifications;
drop policy if exists "Authenticated users can update admin notifications" on public.admin_notifications;
drop policy if exists "Authenticated users can delete admin notifications" on public.admin_notifications;
create policy "Admins can read notifications" on public.admin_notifications for select to authenticated using (public.is_admin());
create policy "Admins can update notifications" on public.admin_notifications for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete notifications" on public.admin_notifications for delete to authenticated using (public.is_admin());

-- Apply the same role check to the admin-only tables.
do $$ declare table_name text; begin
  foreach table_name in array array['enquiries','contact_submissions','call_requests','warranty_claims','staff','projects','page_visits','push_subscriptions'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists "Admins manage data" on public.%I', table_name);
    execute format('create policy "Admins manage data" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', table_name);
  end loop;
end $$;

-- Re-add public form and visitor inserts only. Add Turnstile validation before launch.
create policy "Public can create enquiries" on public.enquiries for insert to anon, authenticated with check (true);
create policy "Public can create contacts" on public.contact_submissions for insert to anon, authenticated with check (true);
create policy "Public can create calls" on public.call_requests for insert to anon, authenticated with check (true);
create policy "Public can create warranty claims" on public.warranty_claims for insert to anon, authenticated with check (true);
create policy "Public can record visits" on public.page_visits for insert to anon, authenticated with check (true);
