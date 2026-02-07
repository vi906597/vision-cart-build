import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingCart, Star, Zap, ArrowLeft, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductImageGallery from "@/components/ProductImageGallery";
import { supabase } from "@/integrations/supabase/client";
import productHeadphones from "@/assets/product-headphones.jpg";
import productBag from "@/assets/product-bag.jpg";
import productPhone from "@/assets/product-phone.jpg";
import productSunglasses from "@/assets/product-sunglasses.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";

// Static products for fallback (when ID starts with 'static-')
const staticProducts = [
  {
    id: "static-1",
    images: [productHeadphones, productBag, productPhone, productSunglasses],
    name: "Premium Wireless Headphones",
    price: 24999,
    category: "Audio",
    rating: 4.8,
    reviews: 245,
    description: "Experience studio-quality sound with our Premium Wireless Headphones. Featuring active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions.",
    features: ["Active Noise Cancellation (ANC)", "40-hour battery life", "Premium memory foam ear cushions", "Bluetooth 5.2 connectivity", "Hi-Res Audio certified"],
    specifications: { "Driver Size": "40mm", "Frequency Response": "20Hz - 40kHz", "Impedance": "32 Ohms", "Weight": "250g" }
  },
  {
    id: "static-2",
    images: [productBag, productSunglasses, productHeadphones],
    name: "Luxury Leather Bag",
    price: 37499,
    category: "Accessories",
    rating: 4.9,
    reviews: 189,
    description: "Crafted from the finest Italian leather, this luxury bag combines timeless elegance with modern functionality.",
    features: ["Genuine Italian leather", "Premium gold-tone hardware", "Multiple interior compartments", "Adjustable shoulder strap"],
    specifications: { "Material": "Italian Leather", "Dimensions": "35cm x 28cm x 12cm", "Weight": "650g" }
  },
  {
    id: "static-3",
    images: [productPhone, productHeadphones, productSneakers, productBag],
    name: "Modern Smartphone",
    price: 74999,
    category: "Electronics",
    rating: 4.7,
    reviews: 512,
    description: "The latest flagship smartphone with cutting-edge technology. Features a stunning 6.7-inch AMOLED display and advanced camera system.",
    features: ["6.7-inch Super AMOLED display", "108MP main camera with AI", "5000mAh battery with fast charging", "5G connectivity"],
    specifications: { "Display": "6.7-inch AMOLED, 120Hz", "Processor": "Latest flagship chipset", "RAM": "12GB", "Storage": "256GB" }
  },
  {
    id: "static-4",
    images: [productSunglasses, productBag, productHeadphones],
    name: "Designer Sunglasses",
    price: 20799,
    category: "Eyewear",
    rating: 4.6,
    reviews: 156,
    description: "Elevate your style with our Designer Sunglasses. Featuring polarized lenses for superior UV protection.",
    features: ["Polarized UV400 lenses", "Lightweight titanium frame", "Anti-reflective coating", "Premium carrying case"],
    specifications: { "Frame Material": "Titanium", "Lens Material": "CR-39 Polarized", "UV Protection": "UV400" }
  },
  {
    id: "static-5",
    images: [productSneakers, productPhone, productBag, productHeadphones],
    name: "Athletic Sneakers",
    price: 14999,
    category: "Footwear",
    rating: 4.8,
    reviews: 423,
    description: "Designed for performance and style, these Athletic Sneakers feature responsive cushioning and breathable mesh upper.",
    features: ["Responsive foam cushioning", "Breathable mesh upper", "Durable rubber outsole", "Lightweight design"],
    specifications: { "Upper Material": "Engineered mesh", "Sole": "Rubber", "Cushioning": "Responsive foam" },
    sizes: ["6", "7", "8", "9", "10", "11"]
  },
  {
    id: "static-6",
    images: [productHeadphones, productPhone, productSneakers],
    name: "Studio Headphones Pro",
    price: 33249,
    category: "Audio",
    rating: 4.9,
    reviews: 367,
    description: "Professional-grade studio headphones for music production and critical listening.",
    features: ["Flat frequency response", "Premium 50mm drivers", "Detachable cables", "Studio-grade sound isolation"],
    specifications: { "Driver Size": "50mm", "Frequency Response": "5Hz - 50kHz", "Impedance": "64 Ohms" }
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

// Static reviews for display
const defaultReviews = [
  { id: 1, name: "Arjun Mehta", avatar: "AM", rating: 5, date: "1 day ago", comment: "Amazing quality! Exceeded my expectations.", verified: true },
  { id: 2, name: "Neha Sharma", avatar: "NS", rating: 5, date: "3 days ago", comment: "Perfect product. Will definitely buy again.", verified: true },
  { id: 3, name: "Karan Singh", avatar: "KS", rating: 4, date: "1 week ago", comment: "Good value for money. Recommended!", verified: true },
  { id: 4, name: "Pooja Reddy", avatar: "PR", rating: 5, date: "2 weeks ago", comment: "Worth every rupee! Premium quality.", verified: false },
];

interface ProductReview {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at: string;
}

interface Product {
  id: string;
  images: string[];
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  sizes?: string[];
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [id]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      
      // Check if it's a static product
      if (id?.startsWith('static-')) {
        const staticProduct = staticProducts.find(p => p.id === id);
        if (staticProduct) {
          setProduct(staticProduct as Product);
        }
        setLoading(false);
        return;
      }

      // Fetch from database (UUID)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          console.error('Error fetching product:', error);
          setProduct(null);
        } else {
          // Format database product
          const dbProduct: Product = {
            id: data.id,
            images: data.images?.length ? data.images : [categoryImages[data.category] || productHeadphones],
            name: data.name,
            price: Number(data.price),
            category: data.category,
            rating: Number(data.rating) || 4.5,
            reviews: data.reviews_count || 0,
            description: data.description || "No description available.",
            features: data.features || [],
            specifications: (data.specifications as Record<string, string>) || {},
            sizes: data.sizes || undefined,
          };
          setProduct(dbProduct);

          // Fetch reviews for this product
          const { data: reviewsData } = await supabase
            .from('product_reviews')
            .select('*')
            .eq('product_id', id)
            .order('created_at', { ascending: false });

          if (reviewsData) {
            setReviews(reviewsData);
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return; // Size selection required
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart({ 
        id: product.id, 
        image: product.images[0], 
        name: product.name, 
        price: product.price, 
        category: product.category,
        size: selectedSize || undefined
      });
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart({ 
        id: product.id, 
        image: product.images[0], 
        name: product.name, 
        price: product.price, 
        category: product.category,
        size: selectedSize || undefined
      });
    }
    navigate("/checkout");
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-secondary rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 bg-secondary rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-secondary rounded w-1/2 animate-pulse"></div>
              <div className="h-10 bg-secondary rounded w-1/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/products")}>Browse Products</Button>
        </div>
      </div>
    );
  }

  // Combine database reviews with default reviews for display
  const displayReviews = reviews.length > 0 
    ? reviews.map(r => ({
        id: r.id,
        name: r.reviewer_name,
        avatar: r.reviewer_name.split(' ').map(n => n[0]).join('').toUpperCase(),
        rating: r.rating,
        date: formatDate(r.created_at),
        comment: r.comment,
        verified: r.is_verified,
      }))
    : defaultReviews;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Product Image Gallery */}
            <div className="relative">
              <ProductImageGallery images={product.images} productName={product.name} />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-4 right-4 rounded-full shadow-md z-10"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-accent text-accent' : ''}`} />
              </Button>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="text-sm text-accent font-medium uppercase tracking-wider">
                  {product.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-lg font-medium">{product.rating}</span>
                <button 
                  onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                >
                  ({product.reviews || displayReviews.length} reviews)
                </button>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-accent">
                ₹{product.price.toLocaleString('en-IN')}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector (for Clothing/Footwear) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <span className="font-medium">Select Size:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => setSelectedSize(size)}
                        className="min-w-[48px]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                  {product.sizes.length > 0 && !selectedSize && (
                    <p className="text-sm text-destructive">Please select a size</p>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-accent hover:bg-accent/90"
                  onClick={handleBuyNow}
                  disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Buy Now
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex flex-col items-center text-center">
                  <Truck className="h-6 w-6 text-accent mb-2" />
                  <span className="text-sm font-medium">Free Delivery</span>
                  <span className="text-xs text-muted-foreground">Orders above ₹500</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-6 w-6 text-accent mb-2" />
                  <span className="text-sm font-medium">Secure Payment</span>
                  <span className="text-xs text-muted-foreground">100% Protected</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RotateCcw className="h-6 w-6 text-accent mb-2" />
                  <span className="text-sm font-medium">Easy Returns</span>
                  <span className="text-xs text-muted-foreground">30-day policy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features & Specifications */}
          {(product.features.length > 0 || Object.keys(product.specifications).length > 0) && (
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Features */}
              {product.features.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Key Features</h2>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Specifications */}
              {Object.keys(product.specifications).length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Specifications</h2>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b last:border-0">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Customer Reviews */}
          <div ref={reviewsRef} className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {displayReviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{review.name}</span>
                        {review.verified && (
                          <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">{review.comment}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
