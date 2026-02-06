-- Add sizes column for clothing products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sizes text[] DEFAULT NULL;

-- Create product_reviews table for admin-managed reviews
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  reviewer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on product_reviews
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can view reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.product_reviews 
FOR SELECT 
USING (true);

-- Only admins can insert reviews
CREATE POLICY "Admins can insert reviews" 
ON public.product_reviews 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update reviews
CREATE POLICY "Admins can update reviews" 
ON public.product_reviews 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete reviews
CREATE POLICY "Admins can delete reviews" 
ON public.product_reviews 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));