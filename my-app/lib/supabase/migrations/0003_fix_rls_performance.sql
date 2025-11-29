-- Enable RLS (idempotent)
alter table profiles enable row level security;
alter table posts enable row level security;

-- Drop all existing policies to resolve conflicts and performance issues
drop policy if exists "Published posts are public" on posts;
drop policy if exists "Admins can read posts" on posts;
drop policy if exists "Admins can write posts" on posts;
drop policy if exists "Authenticated users can view profiles" on profiles;
drop policy if exists "Users can manage own profile" on profiles;
drop policy if exists "Authenticated users can view all posts" on posts;
drop policy if exists "Authenticated users can insert posts" on posts;
drop policy if exists "Authors can update own posts" on posts;
drop policy if exists "Authors can delete own posts" on posts;
drop policy if exists "Anyone can view published posts" on posts;

-- PROFILES POLICIES

-- Optimized: Wrap auth.uid() in select for caching
create policy "Profiles are viewable by everyone"
on profiles for select
using ( true );

create policy "Users can insert their own profile"
on profiles for insert
with check ( id = (select auth.uid()) );

create policy "Users can update their own profile"
on profiles for update
using ( id = (select auth.uid()) );

-- POSTS POLICIES

-- Unified Select: Handles Public, Author, and Admin read access
-- Uses (select auth.uid()) for performance
create policy "Unified select policy for posts"
on posts for select
using (
  is_published = true
  or
  (select auth.uid()) = author_id
  or
  exists (
    select 1 from profiles
    where id = (select auth.uid())
    and role = 'admin'
  )
);

-- Unified Write (Insert/Update/Delete): Handles Author and Admin write access
create policy "Unified insert policy for posts"
on posts for insert
with check (
  (select auth.uid()) = author_id
  or
  exists (
    select 1 from profiles
    where id = (select auth.uid())
    and role = 'admin'
  )
);

create policy "Unified update policy for posts"
on posts for update
using (
  (select auth.uid()) = author_id
  or
  exists (
    select 1 from profiles
    where id = (select auth.uid())
    and role = 'admin'
  )
)
with check (
  (select auth.uid()) = author_id
  or
  exists (
    select 1 from profiles
    where id = (select auth.uid())
    and role = 'admin'
  )
);

create policy "Unified delete policy for posts"
on posts for delete
using (
  (select auth.uid()) = author_id
  or
  exists (
    select 1 from profiles
    where id = (select auth.uid())
    and role = 'admin'
  )
);
