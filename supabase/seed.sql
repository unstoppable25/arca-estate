-- Seed Data for Properties
-- Run this in Supabase SQL Editor after the schema is created.

-- 1. Create a dummy agent profile (so we can link properties)
-- Note: In a real app, you would sign up via the UI. This is just for seeding.
insert into auth.users (id, email)
values ('00000000-0000-0000-0000-000000000001', 'agent@example.com')
on conflict (id) do nothing;

insert into public.profiles (id, email, full_name, role, is_verified)
values ('00000000-0000-0000-0000-000000000001', 'agent@example.com', 'Top Agent', 'agent', true)
on conflict (id) do nothing;

-- 2. Insert Sample Properties
insert into public.properties (owner_id, title, description, price, location, images, features, status)
values 
(
  '00000000-0000-0000-0000-000000000001',
  'Modern Downtown Penthouse',
  'Experience luxury living in this stunning penthouse suite. Features floor-to-ceiling windows, a private terrace, and state-of-the-art appliances.',
  1250000,
  '123 Skyline Dr, New York, NY',
  ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000', 
    'https://images.unsplash.com/photo-1600566753190-17f0bcd2a6c4?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1000'
  ],
  ARRAY['Penthouse', 'City View', 'Terrace', 'Smart Home'],
  'available'
),
(
  '00000000-0000-0000-0000-000000000001',
  'Cozy Family Home with Garden',
  'Perfect for active families, this home features a spacious backyard, modern kitchen, and is located near top-rated schools.',
  850000,
  '45 Maple Ave, Brooklyn, NY',
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000', 
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1000'
  ],
  ARRAY['Garden', 'Garage', 'School District', 'Fireplace'],
  'available'
),
(
  '00000000-0000-0000-0000-000000000001',
  'Minimalist Studio Loft',
  'An open-concept studio perfect for creatives. High ceilings, exposed brick, and abundant natural light.',
  450000,
  '88 Art District Blvd, Los Angeles, CA',
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000', 
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1000'
  ],
  ARRAY['Loft', 'High Ceilings', 'Industrial', 'Gym'],
  'available'
);
