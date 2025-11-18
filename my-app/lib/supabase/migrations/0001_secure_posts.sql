alter table if exists posts enable row level security;

create policy if not exists "Published posts are public" on posts
  for select using (is_published = true);

create policy if not exists "Admins can read posts" on posts
  for select to authenticated using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy if not exists "Admins can write posts" on posts
  for all to authenticated using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  ) with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
