import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter } from "lucide-react";
import productHeadphones from "@/assets/product-headphones.jpg";
import productBag from "@/assets/product-bag.jpg";
import productPhone from "@/assets/product-phone.jpg";
import productSunglasses from "@/assets/product-sunglasses.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";

// Default static products
const defaultProducts = [
  {
    id: 1,
    image: productHeadphones,
    name: "Premium Wireless Headphones",
    price: 24999,
    category: "Audio",
    rating: 4.8,
    reviews: 245,
  },
  {
    id: 2,
    image: productBag,
    name: "Luxury Leather Bag",
    price: 37499,
    category: "Accessories",
    rating: 4.9,
    reviews: 189,
  },
  {
    id: 3,
    image: productPhone,
    name: "Modern Smartphone",
    price: 74999,
    category: "Electronics",
    rating: 4.7,
    reviews: 512,
  },
  {
    id: 4,
    image: productSunglasses,
    name: "Designer Sunglasses",
    price: 20799,
    category: "Eyewear",
    rating: 4.6,
    reviews: 156,
  },
  {
    id: 5,
    image: productSneakers,
    name: "Athletic Sneakers",
    price: 14999,
    category: "Footwear",
    rating: 4.8,
    reviews: 423,
  },
  {
    id: 6,
    image: productHeadphones,
    name: "Studio Headphones Pro",
    price: 33249,
    category: "Audio",
    rating: 4.9,
    reviews: 367,
  },
  {
    id: 7,
    image: productBag,
    name: "Executive Briefcase",
    price: 45999,
    category: "Accessories",
    rating: 4.7,
    reviews: 128,
  },
  {
    id: 8,
    image: productPhone,
    name: "Tablet Pro",
    price: 89999,
    category: "Electronics",
    rating: 4.8,
    reviews: 342,
  },
  {
    id: 9,
    image: productSneakers,
    name: "Running Shoes Elite",
    price: 18999,
    category: "Footwear",
    rating: 4.9,
    reviews: 567,
  },
  {
    id: 10,
    image: productSunglasses,
    name: "Aviator Classic",
    price: 15999,
    category: "Eyewear",
    rating: 4.5,
    reviews: 234,
  },
  {
    id: 11,
    image: productHeadphones,
    name: "Gaming Headset",
    price: 12999,
    category: "Audio",
    rating: 4.6,
    reviews: 445,
  },
  {
    id: 12,
    image: productBag,
    name: "Travel Backpack",
    price: 8999,
    category: "Accessories",
    rating: 4.7,
    reviews: 312,
  },
];

const categoryImages: Record<string, string> = {
  "Audio": productHeadphones,
  "Accessories": productBag,
  "Electronics": productPhone,
  "Eyewear": productSunglasses,
  "Footwear": productSneakers,
  "Clothing": productBag,
};

interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
}

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
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
          const formattedProducts = data.map((p, index) => ({
            id: index + 100,
            image: categoryImages[p.category] || productHeadphones,
            name: p.name,
            price: Number(p.price),
            category: p.category,
            rating: Number(p.rating) || 4.5,
            reviews: p.reviews_count || 0,
          }));
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
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Products</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our complete collection of premium products
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} products
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-secondary rounded-lg mb-4"></div>
                  <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-secondary rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">No products found</p>
              <Button onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
