-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can update posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can delete posts" ON public.posts;

-- Create simpler policies for profiles
-- All authenticated users can read all profiles (needed for author info)
CREATE POLICY "Authenticated users can view profiles" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can insert/update their own profile
CREATE POLICY "Users can manage own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Create simpler policies for posts
-- Anyone can read published posts
CREATE POLICY "Anyone can view published posts" ON public.posts
  FOR SELECT USING (is_published = true);

-- Authenticated users can read all posts (for admin dashboard)
CREATE POLICY "Authenticated users can view all posts" ON public.posts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create posts (we'll handle role check in app code)
CREATE POLICY "Authenticated users can insert posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update posts they authored
CREATE POLICY "Authors can update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Users can delete posts they authored
CREATE POLICY "Authors can delete own posts" ON public.posts
  FOR DELETE USING (auth.uid() = author_id);
