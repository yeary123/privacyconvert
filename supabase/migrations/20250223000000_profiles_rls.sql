-- Phase 10: profiles table for Pro status (9.9 lifetime buyout)
-- Run this in Supabase SQL Editor if not using migrations.

-- Create profiles table if not exists (add columns if table exists from prior phase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  is_pro boolean NOT NULL DEFAULT false,
  pro_since timestamptz,
  paypal_order_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add columns if table already existed without them
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'is_pro') THEN
    ALTER TABLE public.profiles ADD COLUMN is_pro boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'pro_since') THEN
    ALTER TABLE public.profiles ADD COLUMN pro_since timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'paypal_order_id') THEN
    ALTER TABLE public.profiles ADD COLUMN paypal_order_id text;
  END IF;
END $$;

-- RLS: users can only view and update their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Service role can do anything (for webhook and sync-profile server-side)
-- No policy needed for service role; RLS does not apply when using service_role key.

COMMENT ON TABLE public.profiles IS 'User profiles: email, is_pro (9.9 lifetime), pro_since, paypal_order_id';

-- Store Pro purchases by email when user has no profile yet (webhook). Merged on first sign-in.
CREATE TABLE IF NOT EXISTS public.paypal_pro_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  paypal_order_id text,
  captured_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_paypal_pro_purchases_email ON public.paypal_pro_purchases(email);

ALTER TABLE public.paypal_pro_purchases ENABLE ROW LEVEL SECURITY;
-- No SELECT/INSERT policy for anon; only service role (webhook) can write, and we merge in sync-profile server-side.
-- Only service role (API) can access; anon/authenticated cannot (RLS blocks all for this table).
DROP POLICY IF EXISTS "Block all for paypal_pro_purchases" ON public.paypal_pro_purchases;
CREATE POLICY "Block all for paypal_pro_purchases" ON public.paypal_pro_purchases FOR ALL USING (false);
