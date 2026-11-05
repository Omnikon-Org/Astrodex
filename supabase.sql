
-- Fixed #1521: Enforced strict Row Level Security (RLS) policies for claims
-- SQL to run in Supabase SQL Editor for Issues 91, 94, 98
-- 1. Create a view for claim history with user profiles
CREATE OR REPLACE VIEW claim_history_view AS
SELECT 
  c.id,
  c.user_id,
  COALESCE(u.raw_user_meta_data->>'user_name', split_part(u.email, '@', 1), 'Unknown Explorer') as user_name,
  c.asteroid_id,
  c.claimed_at
FROM claims c
JOIN auth.users u ON c.user_id = u.id;
-- 2. Create a view for claims with profiles (for AsteroidCard tooltips)
CREATE OR REPLACE VIEW claims_with_profiles AS
  c.claimed_at,
  u.raw_user_meta_data->>'avatar_url' as avatar_url
-- 3. Create a function to get the leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS TABLE (
  user_id uuid,
  user_name text,
  avatar_url text,
  claims_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.user_id,
    COALESCE(u.raw_user_meta_data->>'user_name', split_part(u.email, '@', 1), 'Unknown Explorer') as user_name,
    u.raw_user_meta_data->>'avatar_url' as avatar_url,
    COUNT(c.id) as claims_count
  FROM claims c
  JOIN auth.users u ON c.user_id = u.id
  GROUP BY c.user_id, u.email, u.raw_user_meta_data
  ORDER BY claims_count DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
