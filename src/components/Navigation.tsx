import { Search, Menu, User, LogOut, X, ShoppingBag, Sparkles, Users, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CartDrawer from "./CartDrawer";
import logo from "@/assets/logo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navigation = () => {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navLinks = [
    { label: "New Arrivals", href: "/products", icon: Sparkles },
    { label: "Men", href: "/products", icon: Users },
    { label: "Women", href: "/products", icon: Users },
    { label: "Accessories", href: "/products", icon: Gem },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/">
              <img src={logo} alt="ZenViero" className="h-8 md:h-10" />
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => navigate("/products")}
            >
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
            <CartDrawer />

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>
                    <img src={logo} alt="ZenViero" className="h-8" />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-6">
                  {navLinks.map((link) => (
                    <Button
                      key={link.label}
                      variant="ghost"
                      className="justify-start gap-3 text-base"
                      onClick={() => {
                        navigate(link.href);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Button>
                  ))}

                  <div className="border-t my-2" />

                  <Button
                    variant="ghost"
                    className="justify-start gap-3 text-base"
                    onClick={() => {
                      navigate("/products");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Search className="h-5 w-5" />
                    Search Products
                  </Button>

                  <Button
                    variant="ghost"
                    className="justify-start gap-3 text-base"
                    onClick={() => {
                      navigate("/products");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    All Products
                  </Button>

                  <div className="border-t my-2" />

                  {user ? (
                    <Button
                      variant="ghost"
                      className="justify-start gap-3 text-base text-destructive"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="justify-start gap-3 text-base"
                      onClick={() => {
                        navigate("/auth");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <User className="h-5 w-5" />
                      Login / Sign Up
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
