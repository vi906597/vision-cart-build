import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  category: string;
}

const ProductCard = ({ image, name, price, category }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className="group relative overflow-hidden border-border hover:shadow-lg transition-all duration-300">
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
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-accent text-accent' : ''}`} />
          </Button>
          <Button
            size="icon"
            className="rounded-full shadow-md bg-accent hover:bg-accent/90"
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
        <p className="text-sm text-muted-foreground mb-3">{category}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            ${price.toFixed(2)}
          </span>
          <Button size="sm" variant="ghost" className="text-accent hover:text-accent/80">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;