import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingCart, Star, Zap } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: number;
  image: string;
  name: string;
  price: number;
  category: string;
  rating?: number;
  reviews?: number;
}

const ProductCard = ({ id, image, name, price, category, rating = 4.5, reviews = 0 }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, image, name, price, category });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, image, name, price, category });
    navigate("/checkout");
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Card 
      className="group relative overflow-hidden border-border hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-accent text-accent' : ''}`} />
          </Button>
          <Button
            size="icon"
            className="rounded-full shadow-md bg-accent hover:bg-accent/90"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-xs font-medium rounded-full">
            {category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold mb-1 text-foreground group-hover:text-accent transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{category}</p>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({reviews} reviews)
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-foreground">
            ₹{price.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-accent hover:bg-accent/90"
            onClick={handleBuyNow}
          >
            <Zap className="h-4 w-4 mr-1" />
            Buy Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;