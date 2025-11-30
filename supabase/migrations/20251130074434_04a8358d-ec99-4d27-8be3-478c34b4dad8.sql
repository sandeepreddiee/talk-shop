-- Create wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own wishlist"
  ON public.wishlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their wishlist"
  ON public.wishlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their wishlist"
  ON public.wishlist FOR DELETE
  USING (auth.uid() = user_id);

-- Create product_comparisons table
CREATE TABLE IF NOT EXISTS public.product_comparisons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_ids UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_comparisons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own comparisons"
  ON public.product_comparisons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create comparisons"
  ON public.product_comparisons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete comparisons"
  ON public.product_comparisons FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime for wishlist
ALTER PUBLICATION supabase_realtime ADD TABLE public.wishlist;