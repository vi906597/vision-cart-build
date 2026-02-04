import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  ShoppingCart, 
  Tag, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  TrendingUp,
  DollarSign,
  Eye,
  LogOut,
  Lock
} from "lucide-react";
import logo from "@/assets/logo.png";
import productHeadphones from "@/assets/product-headphones.jpg";
import productBag from "@/assets/product-bag.jpg";
import productPhone from "@/assets/product-phone.jpg";
import productSunglasses from "@/assets/product-sunglasses.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { User, Session } from "@supabase/supabase-js";

// Sample data for demonstration
const initialProducts = [
  { id: 1, name: "Premium Wireless Headphones", price: 24999, stock: 45, category: "Audio", image: productHeadphones },
  { id: 2, name: "Luxury Leather Bag", price: 37499, stock: 23, category: "Accessories", image: productBag },
  { id: 3, name: "Modern Smartphone", price: 74999, stock: 67, category: "Electronics", image: productPhone },
  { id: 4, name: "Designer Sunglasses", price: 20799, stock: 89, category: "Eyewear", image: productSunglasses },
  { id: 5, name: "Athletic Sneakers", price: 14999, stock: 112, category: "Footwear", image: productSneakers },
];

const initialOrders = [
  { id: "ORD001", customer: "Rahul Sharma", total: 49998, status: "Delivered", date: "2025-02-01", items: 2 },
  { id: "ORD002", customer: "Priya Patel", total: 37499, status: "Shipped", date: "2025-02-02", items: 1 },
  { id: "ORD003", customer: "Amit Kumar", total: 95498, status: "Processing", date: "2025-02-03", items: 3 },
  { id: "ORD004", customer: "Sneha Gupta", total: 14999, status: "Pending", date: "2025-02-03", items: 1 },
  { id: "ORD005", customer: "Vikram Singh", total: 62498, status: "Delivered", date: "2025-01-30", items: 2 },
];

const initialDeals = [
  { id: 1, product: "Modern Smartphone", discount: 28, originalPrice: 74999, salePrice: 53999, active: true },
  { id: 2, product: "Athletic Sneakers", discount: 28, originalPrice: 14999, salePrice: 10799, active: true },
  { id: 3, product: "Luxury Leather Bag", discount: 33, originalPrice: 37499, salePrice: 24999, active: true },
];

const AdminPanel = () => {
  const [products, setProducts] = useState(initialProducts);
  const [orders] = useState(initialOrders);
  const [deals, setDeals] = useState(initialDeals);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin role after auth state change
        if (session?.user) {
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });
      
      if (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data === true);
      }
    } catch (err) {
      console.error("Error:", err);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        toast({
          title: "Login Successful",
          description: "Checking admin access...",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async () => {
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/secure-admin-92`,
        },
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign Up Successful",
          description: "Please check your email to verify your account. After verification, an admin needs to grant you admin access.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
    activeDeals: deals.filter(d => d.active).length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Processing": return "bg-yellow-100 text-yellow-800";
      case "Pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleToggleDeal = (id: number) => {
    setDeals(deals.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Login form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <img src={logo} alt="ZenViero" className="h-10 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-muted-foreground">Sign in to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={authLoading}>
              <Lock className="h-4 w-4 mr-2" />
              {authLoading ? "Signing in..." : "Sign In"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleSignUp}
              disabled={authLoading}
            >
              {authLoading ? "Processing..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={() => navigate("/")}>
              ← Back to Store
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="h-16 w-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges. Please contact the system administrator.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Logged in as: {user.email}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
            <Button className="flex-1" onClick={() => navigate("/")}>
              Go to Store
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Admin panel content
  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="ZenViero" className="h-8" />
            <span className="text-lg font-semibold text-muted-foreground">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              <Eye className="h-4 w-4 mr-2" />
              View Store
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-3xl font-bold">{stats.totalProducts}</p>
              </div>
              <Package className="h-10 w-10 text-accent" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-10 w-10 text-accent" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">₹{stats.revenue.toLocaleString('en-IN')}</p>
              </div>
              <DollarSign className="h-10 w-10 text-accent" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Deals</p>
                <p className="text-3xl font-bold">{stats.activeDeals}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-accent" />
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="deals" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Deals
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Products Management</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Stock</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-secondary/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{product.category}</td>
                        <td className="py-3 px-4">₹{product.price.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${product.stock < 30 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Orders Management</h2>
                <div className="flex gap-2">
                  <Input placeholder="Search orders..." className="w-64" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Items</th>
                      <th className="text-left py-3 px-4">Total</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-secondary/50">
                        <td className="py-3 px-4 font-mono">{order.id}</td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4">{order.items}</td>
                        <td className="py-3 px-4 font-semibold">₹{order.total.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4">{order.date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Deals Tab */}
          <TabsContent value="deals">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Special Deals Management</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Deal
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Original Price</th>
                      <th className="text-left py-3 px-4">Sale Price</th>
                      <th className="text-left py-3 px-4">Discount</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deals.map((deal) => (
                      <tr key={deal.id} className="border-b hover:bg-secondary/50">
                        <td className="py-3 px-4 font-medium">{deal.product}</td>
                        <td className="py-3 px-4 text-muted-foreground line-through">₹{deal.originalPrice.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 font-semibold text-accent">₹{deal.salePrice.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4">
                          <span className="bg-accent/20 text-accent px-2 py-1 rounded font-semibold">
                            {deal.discount}% OFF
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${deal.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {deal.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleToggleDeal(deal.id)}>
                              {deal.active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Store Settings</h2>
              <div className="space-y-6 max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" defaultValue="ZenViero" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Contact Email</Label>
                  <Input id="storeEmail" type="email" defaultValue="contact@zenviero.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Contact Phone</Label>
                  <Input id="storePhone" defaultValue="+91 9876543210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" defaultValue="INR (₹)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealTimer">Deal Timer (minutes)</Label>
                  <Input id="dealTimer" type="number" defaultValue="10" />
                </div>
                <Button>Save Settings</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
