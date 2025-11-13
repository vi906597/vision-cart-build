import { Star, Quote, ThumbsUp, Verified } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    date: "2 days ago",
    verified: true,
    product: "Premium Wireless Headphones",
    review:
      "Absolutely love these headphones! The sound quality is exceptional and they're incredibly comfortable for long listening sessions. Worth every penny!",
    helpful: 45,
    image: "SJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    date: "1 week ago",
    verified: true,
    product: "Modern Smartphone",
    review:
      "Best phone I've owned. Camera is outstanding, battery lasts all day, and the display is gorgeous. Fast delivery too!",
    helpful: 32,
    image: "MC",
  },
  {
    id: 3,
    name: "Emma Williams",
    rating: 4,
    date: "2 weeks ago",
    verified: true,
    product: "Luxury Leather Bag",
    review:
      "Beautiful craftsmanship and the leather quality is top-notch. Slightly smaller than expected but still perfect for daily use.",
    helpful: 28,
    image: "EW",
  },
  {
    id: 4,
    name: "David Rodriguez",
    rating: 5,
    date: "3 weeks ago",
    verified: true,
    product: "Athletic Sneakers",
    review:
      "These sneakers are incredibly comfortable! Great for running and everyday wear. The design is sleek and modern.",
    helpful: 56,
    image: "DR",
  },
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-accent text-accent"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
};

const CustomerReviews = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            Customer Feedback
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real reviews from real customers who love our products
          </p>
        </div>

        {/* Overall Rating Summary */}
        <Card className="p-8 mb-12 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="text-6xl font-bold text-accent mb-2">4.8</div>
              <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                <RatingStars rating={5} />
              </div>
              <p className="text-muted-foreground">Based on 1,250+ reviews</p>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12">{stars} star</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{
                        width: `${stars === 5 ? 75 : stars === 4 ? 18 : stars === 3 ? 5 : 2}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {stars === 5 ? "75%" : stars === 4 ? "18%" : stars === 3 ? "5%" : "2%"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-accent/20 mb-4" />

              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-accent/10">
                    <AvatarFallback className="text-accent font-semibold">
                      {review.image}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{review.name}</h4>
                      {review.verified && (
                        <Verified className="h-4 w-4 text-accent fill-accent" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.date}
                    </p>
                  </div>
                </div>
                <RatingStars rating={review.rating} />
              </div>

              {/* Product Name */}
              <div className="text-sm font-medium text-accent mb-3">
                {review.product}
              </div>

              {/* Review Text */}
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {review.review}
              </p>

              {/* Helpful Button */}
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-accent"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Helpful ({review.helpful})
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Button size="lg" variant="outline">
            Load More Reviews
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;