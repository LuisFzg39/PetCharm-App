-- Add created_at column to existing posts table
-- Run this in Supabase SQL Editor

ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- Add created_at column to existing comments table (if needed)
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- Add created_at column to existing likes table (if needed)
ALTER TABLE public.likes 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- Add created_at column to existing comment_likes table (if needed)
ALTER TABLE public.comment_likes 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- Add created_at column to existing users table (if needed)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone default timezone('utc'::text, now()) not null;
