import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import productHeadphones from "@/assets/product-headphones.jpg";
import productBag from "@/assets/product-bag.jpg";
import productPhone from "@/assets/product-phone.jpg";
import productSunglasses from "@/assets/product-sunglasses.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";

// Default static products as fallback
const defaultProducts = [
  {
    id: "static-1",
    image: productHeadphones,
    name: "Premium Wireless Headphones",
    price: 24999,
    category: "Audio",
    rating: 4.8,
    reviews: 245,
  },
  {
    id: "static-2",
    image: productBag,
    name: "Luxury Leather Bag",
    price: 37499,
    category: "Accessories",
    rating: 4.9,
    reviews: 189,
  },
  {
    id: "static-3",
    image: productPhone,
    name: "Modern Smartphone",
    price: 74999,
    category: "Electronics",
    rating: 4.7,
    reviews: 512,
  },
  {
    id: "static-4",
    image: productSunglasses,
    name: "Designer Sunglasses",
    price: 20799,
    category: "Eyewear",
    rating: 4.6,
    reviews: 156,
  },
  {
    id: "static-5",
    image: productSneakers,
    name: "Athletic Sneakers",
    price: 14999,
    category: "Footwear",
    rating: 4.8,
    reviews: 423,
  },
  {
    id: "static-6",
    image: productHeadphones,
    name: "Studio Headphones Pro",
    price: 33249,
    category: "Audio",
    rating: 4.9,
    reviews: 367,
  },
];

// Image mapping for database products
const categoryImages: Record<string, string> = {
  "Audio": productHeadphones,
  "Accessories": productBag,
  "Electronics": productPhone,
  "Eyewear": productSunglasses,
  "Footwear": productSneakers,
  "Clothing": productBag,
};

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
}

const FeaturedProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const categories = ["All", "Audio", "Accessories", "Electronics", "Eyewear", "Footwear"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          setProducts(defaultProducts);
        } else if (data && data.length > 0) {
          const formattedProducts: Product[] = data.map((p) => ({
            id: p.id, // Use actual UUID from database
            image: p.images?.[0] || categoryImages[p.category] || productHeadphones,
            name: p.name,
            price: Number(p.price),
            category: p.category,
            rating: Number(p.rating) || 4.5,
            reviews: p.reviews_count || 0,
          }));
          // Combine database products with default products
          setProducts([...formattedProducts, ...defaultProducts]);
        } else {
          setProducts(defaultProducts);
        }
      } catch (err) {
        console.error('Error:', err);
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  const filteredProducts = selectedCategory === "All" 
    ? products.slice(0, 6) // Show first 6 products on home
    : products.filter(product => product.category === selectedCategory).slice(0, 6);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            Featured Collection
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Trending Now
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our handpicked selection of premium products that define style and quality
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-secondary rounded-lg mb-4"></div>
                <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-secondary rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            onClick={() => navigate('/products')}
            className="px-8"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
