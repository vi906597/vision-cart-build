import { Button } from "@/components/ui/button";
import { Clock, Tag, TrendingUp, ShoppingCart, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import productPhone from "@/assets/product-phone.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";
import productBag from "@/assets/product-bag.jpg";

const offers = [
  {
    id: 3,
    image: productPhone,
    name: "Modern Smartphone",
    originalPrice: 899.99,
    discountPrice: 649.99,
    discount: 28,
    badge: "Flash Sale",
    category: "Electronics",
  },
  {
    id: 5,
    image: productSneakers,
    name: "Athletic Sneakers",
    originalPrice: 179.99,
    discountPrice: 129.99,
    discount: 28,
    badge: "Limited Offer",
    category: "Footwear",
  },
  {
    id: 2,
    image: productBag,
    name: "Luxury Leather Bag",
    originalPrice: 449.99,
    discountPrice: 299.99,
    discount: 33,
    badge: "Deal of the Day",
    category: "Accessories",
  },
];

const TIMER_DURATION = 10 * 60; // 10 minutes in seconds

const CountdownTimer = ({ onExpire }: { onExpire: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedEndTime = localStorage.getItem('dealEndTime');
    if (savedEndTime) {
      const remaining = Math.floor((parseInt(savedEndTime) - Date.now()) / 1000);
      return remaining > 0 ? remaining : TIMER_DURATION;
    }
    return TIMER_DURATION;
  });

  useEffect(() => {
    // Set end time in localStorage if not exists
    const savedEndTime = localStorage.getItem('dealEndTime');
    if (!savedEndTime || parseInt(savedEndTime) < Date.now()) {
      localStorage.setItem('dealEndTime', String(Date.now() + TIMER_DURATION * 1000));
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Reset timer
          localStorage.setItem('dealEndTime', String(Date.now() + TIMER_DURATION * 1000));
          onExpire();
          return TIMER_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex items-center gap-3 text-sm font-medium">
      <Clock className="h-4 w-4 text-accent" />
      <div className="flex items-center gap-1">
        <span className="bg-accent text-accent-foreground px-2 py-1 rounded font-bold">
          {String(hours).padStart(2, "0")}
        </span>
        <span className="text-accent font-bold">:</span>
        <span className="bg-accent text-accent-foreground px-2 py-1 rounded font-bold">
          {String(minutes).padStart(2, "0")}
        </span>
        <span className="text-accent font-bold">:</span>
        <span className="bg-accent text-accent-foreground px-2 py-1 rounded font-bold">
          {String(secs).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

const SpecialOffers = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [, setRefresh] = useState(0);

  const handleAddToCart = (offer: typeof offers[0]) => {
    addToCart({
      id: offer.id,
      image: offer.image,
      name: offer.name,
      price: offer.discountPrice,
      category: offer.category,
    });
  };

  const handleBuyNow = (offer: typeof offers[0]) => {
    addToCart({
      id: offer.id,
      image: offer.image,
      name: offer.name,
      price: offer.discountPrice,
      category: offer.category,
    });
    navigate("/checkout");
  };

  const handleTimerExpire = () => {
    setRefresh(prev => prev + 1);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-accent/5 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6 text-accent" />
              <span className="text-sm font-medium text-accent uppercase tracking-wider">
                Limited Time Only
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Today's Best Deals
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-sm text-muted-foreground">Offers end in:</span>
            <CountdownTimer onExpire={handleTimerExpire} />
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-accent text-accent-foreground px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 shadow-lg">
                  <Tag className="h-3.5 w-3.5" />
                  {offer.discount}% OFF
                </div>
              </div>

              {/* Deal Type Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-medium text-xs">
                  {offer.badge}
                </div>
              </div>

              {/* Image */}
              <div 
                className="relative aspect-square bg-secondary overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${offer.id}`)}
              >
                <img
                  src={offer.image}
                  alt={offer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 
                  className="font-semibold text-lg mb-3 group-hover:text-accent transition-colors cursor-pointer"
                  onClick={() => navigate(`/product/${offer.id}`)}
                >
                  {offer.name}
                </h3>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-bold text-accent">
                    ${offer.discountPrice}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    ${offer.originalPrice}
                  </span>
                </div>

                {/* Savings */}
                <div className="mb-4 p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm text-accent font-medium">
                    🎉 You save ${(offer.originalPrice - offer.discountPrice).toFixed(2)}!
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleAddToCart(offer)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                  <Button 
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => handleBuyNow(offer)}
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;