import { ShoppingCart, Search, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [cartCount] = useState(3);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/auth");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold tracking-tight">LUXE</h1>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
                New Arrivals
              </a>
              <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
                Men
              </a>
              <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
                Women
              </a>
              <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
                Accessories
              </a>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            {user ? (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex"
                onClick={() => navigate("/auth")}
              >
                <User className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;