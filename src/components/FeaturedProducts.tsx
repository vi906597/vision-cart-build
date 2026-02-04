import { useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
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
];

const FeaturedProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const categories = ["All", "Audio", "Accessories", "Electronics", "Eyewear", "Footwear"];
  
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;