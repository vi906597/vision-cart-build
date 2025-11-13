import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroWatch from "@/assets/hero-watch.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroWatch}
          alt="Luxury Watch"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 md:py-40">
        <div className="max-w-2xl">
          <div className="inline-block mb-4 px-4 py-1.5 bg-accent/20 backdrop-blur-sm rounded-full">
            <span className="text-sm font-medium text-accent-foreground">New Collection 2024</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary-foreground leading-tight">
            Timeless
            <br />
            Elegance
          </h1>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 max-w-xl">
            Discover our curated collection of premium products designed for those who appreciate quality and style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              Explore Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-sm text-primary-foreground/70">Scroll</span>
          <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary-foreground/50 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;