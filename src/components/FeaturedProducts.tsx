import ProductCard from "./ProductCard";
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
  },
  {
    id: 2,
    image: productBag,
    name: "Luxury Leather Bag",
    price: 449.99,
    category: "Accessories",
    rating: 4.9,
    reviews: 189,
  },
  {
    id: 3,
    image: productPhone,
    name: "Modern Smartphone",
    price: 899.99,
    category: "Electronics",
    rating: 4.7,
    reviews: 512,
  },
  {
    id: 4,
    image: productSunglasses,
    name: "Designer Sunglasses",
    price: 249.99,
    category: "Eyewear",
    rating: 4.6,
    reviews: 156,
  },
  {
    id: 5,
    image: productSneakers,
    name: "Athletic Sneakers",
    price: 179.99,
    category: "Footwear",
    rating: 4.8,
    reviews: 423,
  },
  {
    id: 6,
    image: productHeadphones,
    name: "Studio Headphones Pro",
    price: 399.99,
    category: "Audio",
    rating: 4.9,
    reviews: 367,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
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