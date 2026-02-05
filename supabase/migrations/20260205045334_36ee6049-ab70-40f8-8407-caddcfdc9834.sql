-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  features TEXT[],
  specifications JSONB,
  stock INTEGER NOT NULL DEFAULT 0,
  images TEXT[],
  rating NUMERIC DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  is_deal BOOLEAN DEFAULT FALSE,
  deal_price NUMERIC,
  deal_discount INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_state TEXT NOT NULL,
  customer_pincode TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  payment_method TEXT NOT NULL,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Products are publicly viewable
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Only admins can insert/update/delete products
CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Orders are viewable by admins only
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can create orders (for checkout)
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Admins can update orders
CREATE POLICY "Admins can update orders" 
ON public.orders 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial products data
INSERT INTO public.products (name, price, category, description, stock, images, rating, reviews_count, features, specifications) VALUES
('Premium Wireless Headphones', 24999, 'Audio', 'Experience studio-quality sound with our Premium Wireless Headphones. Featuring active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions.', 45, ARRAY['/product-headphones.jpg'], 4.8, 245, ARRAY['Active Noise Cancellation (ANC)', '40-hour battery life', 'Premium memory foam ear cushions', 'Bluetooth 5.2 connectivity'], '{"Driver Size": "40mm", "Frequency Response": "20Hz - 40kHz", "Impedance": "32 Ohms"}'),
('Luxury Leather Bag', 37499, 'Accessories', 'Crafted from the finest Italian leather, this luxury bag combines timeless elegance with modern functionality.', 23, ARRAY['/product-bag.jpg'], 4.9, 189, ARRAY['Genuine Italian leather', 'Premium gold-tone hardware', 'Multiple interior compartments'], '{"Material": "Italian Leather", "Dimensions": "35cm x 28cm x 12cm"}'),
('Modern Smartphone', 74999, 'Electronics', 'The latest flagship smartphone with cutting-edge technology. Features a stunning 6.7-inch AMOLED display.', 67, ARRAY['/product-phone.jpg'], 4.7, 512, ARRAY['6.7-inch Super AMOLED display', '108MP main camera with AI', '5000mAh battery with fast charging'], '{"Display": "6.7-inch AMOLED, 120Hz", "Processor": "Latest flagship chipset", "RAM": "12GB"}'),
('Designer Sunglasses', 20799, 'Eyewear', 'Elevate your style with our Designer Sunglasses. Featuring polarized lenses for superior UV protection.', 89, ARRAY['/product-sunglasses.jpg'], 4.6, 156, ARRAY['Polarized UV400 lenses', 'Lightweight titanium frame', 'Anti-reflective coating'], '{"Frame Material": "Titanium", "Lens Material": "CR-39 Polarized", "UV Protection": "UV400"}'),
('Athletic Sneakers', 14999, 'Footwear', 'Designed for performance and style, these Athletic Sneakers feature responsive cushioning.', 112, ARRAY['/product-sneakers.jpg'], 4.8, 423, ARRAY['Responsive foam cushioning', 'Breathable mesh upper', 'Durable rubber outsole'], '{"Upper Material": "Engineered mesh", "Sole": "Rubber", "Cushioning": "Responsive foam"}'),
('Studio Headphones Pro', 33249, 'Audio', 'Professional-grade studio headphones for music production and critical listening.', 34, ARRAY['/product-headphones.jpg'], 4.9, 367, ARRAY['Flat frequency response', 'Premium 50mm drivers', 'Detachable cables'], '{"Driver Size": "50mm", "Frequency Response": "5Hz - 50kHz", "Impedance": "64 Ohms"}');