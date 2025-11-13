import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import SpecialOffers from "@/components/SpecialOffers";
import CustomerReviews from "@/components/CustomerReviews";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Categories />
      <SpecialOffers />
      <FeaturedProducts />
      <CustomerReviews />
      <Footer />
    </div>
  );
};

export default Index;