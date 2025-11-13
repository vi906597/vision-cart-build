import { Watch, Headphones, ShoppingBag, Smartphone } from "lucide-react";

const categories = [
  {
    icon: Watch,
    name: "Watches",
    count: "120+ Items",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Headphones,
    name: "Audio",
    count: "85+ Items",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: ShoppingBag,
    name: "Bags",
    count: "150+ Items",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Smartphone,
    name: "Electronics",
    count: "200+ Items",
    color: "bg-primary/10 text-primary",
  },
];

const Categories = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground">
            Browse through our diverse range of premium categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className="group p-8 bg-card rounded-2xl border border-border hover:border-accent hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">{category.count}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;