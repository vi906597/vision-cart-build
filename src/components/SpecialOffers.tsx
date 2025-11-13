import { Button } from "@/components/ui/button";
import { Clock, Tag, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import productPhone from "@/assets/product-phone.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";
import productBag from "@/assets/product-bag.jpg";

const offers = [
  {
    id: 1,
    image: productPhone,
    name: "Modern Smartphone",
    originalPrice: 899.99,
    discountPrice: 649.99,
    discount: 28,
    badge: "Flash Sale",
    endsIn: 3600, // seconds
  },
  {
    id: 2,
    image: productSneakers,
    name: "Athletic Sneakers",
    originalPrice: 179.99,
    discountPrice: 129.99,
    discount: 28,
    badge: "Limited Offer",
    endsIn: 7200,
  },
  {
    id: 3,
    image: productBag,
    name: "Luxury Leather Bag",
    originalPrice: 449.99,
    discountPrice: 299.99,
    discount: 33,
    badge: "Deal of the Day",
    endsIn: 5400,
  },
];

const CountdownTimer = ({ seconds }: { seconds: number }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <Clock className="h-4 w-4 text-accent" />
      <span className="text-foreground">
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(secs).padStart(2, "0")}
      </span>
    </div>
  );
};

const SpecialOffers = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-accent/5 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
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
          <Button variant="outline" className="hidden md:flex">
            View All Offers
          </Button>
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
              <div className="relative aspect-square bg-secondary overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-3 group-hover:text-accent transition-colors">
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

                {/* Countdown */}
                <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">
                    Offer ends in:
                  </div>
                  <CountdownTimer seconds={offer.endsIn} />
                </div>

                {/* CTA Button */}
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Grab This Deal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;