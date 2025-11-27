-- Fix incorrect unique constraint on comment_likes table
-- The constraint should be on (comment_id, user_id) together, not just user_id

-- Drop the incorrect constraint
ALTER TABLE public.comment_likes 
DROP CONSTRAINT IF EXISTS comment_likes_user_id_key;

-- Ensure the correct unique constraint exists on (comment_id, user_id)
-- This should already exist from the CREATE TABLE, but let's make sure
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'comment_likes_comment_id_user_id_key'
    ) THEN
        ALTER TABLE public.comment_likes 
        ADD CONSTRAINT comment_likes_comment_id_user_id_key 
        UNIQUE (comment_id, user_id);
    END IF;
END $$;
