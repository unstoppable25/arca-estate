-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ENUMS
create type user_role as enum ('guest', 'user', 'agent', 'admin');
create type property_status as enum ('available', 'sold', 'rented', 'pending');
create type property_type as enum ('rent', 'buy', 'short-let');
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type listing_plan as enum ('basic', 'premium', 'featured');
create type verification_status as enum ('unverified', 'pending', 'verified', 'rejected');

-- 2. PROFILES (Public user data)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role user_role default 'user',
  verification_status verification_status default 'unverified',
  identity_document_url text, -- URL to uploaded ID
  phone_number text,
  is_phone_verified boolean default false,
  subscription_plan listing_plan default 'basic',
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: Profiles are viewable by everyone, editable only by self
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- 3. PROPERTIES (Real Estate Listings)
create table public.properties (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null, 
  title text not null,
  description text,
  price numeric not null,
  location text not null,
  coordinates point, -- Lat/Long for Mapbox
  type property_type not null default 'buy',
  bedrooms integer default 0,
  bathrooms integer default 0,
  amenities jsonb default '[]',
  images text[] default '{}',
  video_tour_url text,
  status property_status default 'available',
  self_viewing_enabled boolean default false,
  lockbox_code text, -- Visible only to owner/admin or active booking user
  viewing_slots jsonb default '[]', -- Array of time slots
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: Properties viewable by everyone. Update/Delete only by Owner (Agent) or Admin.
alter table public.properties enable row level security;
create policy "Properties are viewable by everyone" on public.properties for select using (true);
create policy "Agents can insert properties" on public.properties for insert with check (auth.uid() = owner_id);
create policy "Agents can update own properties" on public.properties for update using (auth.uid() = owner_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Agents can delete own properties" on public.properties for delete using (auth.uid() = owner_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 4. SAVED PROPERTIES (Wishlist)
create table public.saved_properties (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, property_id)
);

alter table public.saved_properties enable row level security;
create policy "Users can manage own saved properties" on public.saved_properties for all using (auth.uid() = user_id);

-- 5. SAVED SEARCHES
create table public.saved_searches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text,
  filters jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.saved_searches enable row level security;
create policy "Users can manage own saved searches" on public.saved_searches for all using (auth.uid() = user_id);

-- 6. BOOKINGS (Self-Guided Tours)
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  viewing_code text, -- 6-digit code linked to lockbox
  status booking_status default 'pending',
  feedback_rating integer check (feedback_rating >= 1 and feedback_rating <= 5),
  feedback_text text,
  feedback_media_urls text[] default '{}', -- Audio/Video feedback
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: Users can see their own bookings. Agents can see bookings for their properties.
alter table public.bookings enable row level security;
create policy "Users can see own bookings" on public.bookings for select using (auth.uid() = user_id or exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid()));
create policy "Users can create bookings" on public.bookings for insert with check (auth.uid() = user_id);

-- 7. LEADS (Inquiries)
create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade,
  agent_id uuid references public.profiles(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  message text,
  source text default 'contact_form',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.leads enable row level security;
create policy "Agents can see leads for their properties" on public.leads for select using (auth.uid() = agent_id);
create policy "Users can see own leads" on public.leads for select using (auth.uid() = user_id);
create policy "Anyone can create leads" on public.leads for insert with check (true);

-- 8. NOTIFICATIONS
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;
create policy "Users can see own notifications" on public.notifications for select using (auth.uid() = user_id);

-- 9. TRIGGER: Auto-create Profile on Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', coalesce((new.raw_user_meta_data->>'role')::user_role, 'user'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
