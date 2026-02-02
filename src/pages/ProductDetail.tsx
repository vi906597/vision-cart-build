import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingCart, Star, Zap, ArrowLeft, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import productHeadphones from "@/assets/product-headphones.jpg";
import productBag from "@/assets/product-bag.jpg";
import productPhone from "@/assets/product-phone.jpg";
import productSunglasses from "@/assets/product-sunglasses.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";

const products = [
  {
    id: 1,
    image: productHeadphones,
    name: "Premium Wireless Headphones",
    price: 299.99,
    category: "Audio",
    rating: 4.8,
    reviews: 245,
    description: "Experience studio-quality sound with our Premium Wireless Headphones. Featuring active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for audiophiles and music lovers who demand the best.",
    features: [
      "Active Noise Cancellation (ANC)",
      "40-hour battery life",
      "Premium memory foam ear cushions",
      "Bluetooth 5.2 connectivity",
      "Hi-Res Audio certified",
      "Foldable design with premium case"
    ],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 40kHz",
      "Impedance": "32 Ohms",
      "Weight": "250g",
      "Connectivity": "Bluetooth 5.2, 3.5mm jack"
    }
  },
  {
    id: 2,
    image: productBag,
    name: "Luxury Leather Bag",
    price: 449.99,
    category: "Accessories",
    rating: 4.9,
    reviews: 189,
    description: "Crafted from the finest Italian leather, this luxury bag combines timeless elegance with modern functionality. Features multiple compartments, premium hardware, and a spacious interior perfect for daily essentials.",
    features: [
      "Genuine Italian leather",
      "Premium gold-tone hardware",
      "Multiple interior compartments",
      "Adjustable shoulder strap",
      "Dust bag included",
      "Handcrafted finish"
    ],
    specifications: {
      "Material": "Italian Leather",
      "Dimensions": "35cm x 28cm x 12cm",
      "Strap Length": "Adjustable 80-120cm",
      "Weight": "650g",
      "Color": "Classic Brown"
    }
  },
  {
    id: 3,
    image: productPhone,
    name: "Modern Smartphone",
    price: 899.99,
    category: "Electronics",
    rating: 4.7,
    reviews: 512,
    description: "The latest flagship smartphone with cutting-edge technology. Features a stunning 6.7-inch AMOLED display, powerful processor, and an advanced camera system for professional-quality photos and videos.",
    features: [
      "6.7-inch Super AMOLED display",
      "108MP main camera with AI",
      "5000mAh battery with fast charging",
      "256GB internal storage",
      "5G connectivity",
      "Water resistant IP68"
    ],
    specifications: {
      "Display": "6.7-inch AMOLED, 120Hz",
      "Processor": "Latest flagship chipset",
      "RAM": "12GB",
      "Storage": "256GB",
      "Battery": "5000mAh"
    }
  },
  {
    id: 4,
    image: productSunglasses,
    name: "Designer Sunglasses",
    price: 249.99,
    category: "Eyewear",
    rating: 4.6,
    reviews: 156,
    description: "Elevate your style with our Designer Sunglasses. Featuring polarized lenses for superior UV protection and a lightweight titanium frame for all-day comfort. The perfect blend of fashion and function.",
    features: [
      "Polarized UV400 lenses",
      "Lightweight titanium frame",
      "Anti-reflective coating",
      "Scratch-resistant lenses",
      "Premium carrying case",
      "Microfiber cleaning cloth"
    ],
    specifications: {
      "Frame Material": "Titanium",
      "Lens Material": "CR-39 Polarized",
      "UV Protection": "UV400",
      "Frame Width": "142mm",
      "Weight": "28g"
    }
  },
  {
    id: 5,
    image: productSneakers,
    name: "Athletic Sneakers",
    price: 179.99,
    category: "Footwear",
    rating: 4.8,
    reviews: 423,
    description: "Designed for performance and style, these Athletic Sneakers feature responsive cushioning, breathable mesh upper, and durable outsole. Perfect for running, training, or everyday wear.",
    features: [
      "Responsive foam cushioning",
      "Breathable mesh upper",
      "Durable rubber outsole",
      "Lightweight design",
      "Reflective details",
      "Removable insole"
    ],
    specifications: {
      "Upper Material": "Engineered mesh",
      "Sole": "Rubber",
      "Cushioning": "Responsive foam",
      "Drop": "10mm",
      "Weight": "280g (Size 9)"
    }
  },
  {
    id: 6,
    image: productHeadphones,
    name: "Studio Headphones Pro",
    price: 399.99,
    category: "Audio",
    rating: 4.9,
    reviews: 367,
    description: "Professional-grade studio headphones for music production and critical listening. Featuring flat frequency response, exceptional detail, and supreme comfort for extended studio sessions.",
    features: [
      "Flat frequency response",
      "Premium 50mm drivers",
      "Detachable cables",
      "Rotating ear cups",
      "Professional carrying case",
      "Studio-grade sound isolation"
    ],
    specifications: {
      "Driver Size": "50mm",
      "Frequency Response": "5Hz - 50kHz",
      "Impedance": "64 Ohms",
      "Weight": "320g",
      "Cable Length": "3m coiled, 1.2m straight"
    }
  },
];

const customerReviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "RS",
    rating: 5,
    date: "2 days ago",
    comment: "Absolutely love this product! The quality is outstanding and it exceeded my expectations. Highly recommend!",
    verified: true
  },
  {
    id: 2,
    name: "Priya Patel",
    avatar: "PP",
    rating: 4,
    date: "1 week ago",
    comment: "Great product for the price. Fast delivery and well packaged. Would buy again.",
    verified: true
  },
  {
    id: 3,
    name: "Amit Kumar",
    avatar: "AK",
    rating: 5,
    date: "2 weeks ago",
    comment: "Premium quality! You can really feel the difference. Worth every penny spent.",
    verified: true
  },
  {
    id: 4,
    name: "Sneha Gupta",
    avatar: "SG",
    rating: 4,
    date: "3 weeks ago",
    comment: "Very satisfied with my purchase. The product looks exactly like the pictures. Good customer service too.",
    verified: false
  },
  {
    id: 5,
    name: "Vikram Singh",
    avatar: "VS",
    rating: 5,
    date: "1 month ago",
    comment: "Best purchase I've made this year! The quality is exceptional and it arrived before the expected date.",
    verified: true
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/")}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, image: product.image, name: product.name, price: product.price, category: product.category });
    }
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, image: product.image, name: product.name, price: product.price, category: product.category });
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
            {/* Product Image */}
            <div className="relative">
              <Card className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              </Card>
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-4 right-4 rounded-full shadow-md"
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
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-accent">
                ${product.price.toFixed(2)}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

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
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-accent hover:bg-accent/90"
                  onClick={handleBuyNow}
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
                  <span className="text-xs text-muted-foreground">Orders above $50</span>
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
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Features */}
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

            {/* Specifications */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Specifications</h2>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Customer Reviews */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="font-medium">{product.rating} out of 5</span>
              </div>
            </div>

            <div className="space-y-6">
              {customerReviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.name}</span>
                        {review.verified && (
                          <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
