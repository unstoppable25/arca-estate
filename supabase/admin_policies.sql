-- 1. Create a secure function to check if the current user is an admin
create or replace function public.is_admin()
returns boolean
language sql
security definer -- Runs with privileges of the creator (postgres/supabase_admin)
set search_path = public -- Secure search path
as $$
  select exists (
    select 1
    from profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

-- 2. Update PROFILES policies
create policy "Admins can update any profile"
  on public.profiles
  for update
  using ( is_admin() );

-- 3. Update PROPERTIES policies
create policy "Admins can update any property"
  on public.properties
  for update
  using ( is_admin() );

create policy "Admins can delete any property"
  on public.properties
  for delete
  using ( is_admin() );

-- 4. Update BOOKINGS policies
create policy "Admins can view all bookings"
  on public.bookings
  for select
  using ( is_admin() );
