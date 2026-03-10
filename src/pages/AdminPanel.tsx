import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  Lock,
  Save,
  X,
  Star,
  MessageSquare,
  Image as ImageIcon,
  Upload,
  Loader2,
  FileSpreadsheet,
  Download,
  CheckCircle,
  AlertCircle,
  Inbox
} from "lucide-react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { User, Session } from "@supabase/supabase-js";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string | null;
  stock: number;
  images: string[] | null;
  sizes: string[] | null;
  features: string[] | null;
  rating: number | null;
  reviews_count: number | null;
  is_deal: boolean | null;
  deal_price: number | null;
  deal_discount: number | null;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_state: string;
  customer_pincode: string;
  items: any;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
}

interface ProductReview {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at: string;
}

const categories = ["Audio", "Electronics", "Accessories", "Eyewear", "Footwear", "Clothing"];
const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const shoeSizes = ["6", "7", "8", "9", "10", "11", "12"];

const AdminPanel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForReview, setSelectedProductForReview] = useState<string>("");
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    images: ["", "", "", ""],
    sizes: [] as string[],
    features: "",
    is_deal: false,
    deal_price: "",
    deal_discount: "",
  });
  const [reviewForm, setReviewForm] = useState({
    product_id: "",
    reviewer_name: "",
    rating: "5",
    comment: "",
    is_verified: true,
    created_at: "",
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingReview, setSavingReview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvResults, setCsvResults] = useState<{ success: number; errors: string[] } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
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

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      setReviews(data || []);
    }
  };

  const fetchContactMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setContactMessages(data || []);
  };

  const deleteContactMessage = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id);
    fetchContactMessages();
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchOrders();
      fetchReviews();
      fetchContactMessages();
    }
  }, [isAdmin]);

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
          description: "Please check your email to verify your account.",
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

  const openAddProductDialog = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: "",
      category: "",
      description: "",
      stock: "",
      images: ["", "", "", ""],
      sizes: [],
      features: "",
      is_deal: false,
      deal_price: "",
      deal_discount: "",
    });
    setProductDialogOpen(true);
  };

  const openEditProductDialog = (product: Product) => {
    setEditingProduct(product);
    const images = product.images || [];
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || "",
      stock: product.stock.toString(),
      images: [images[0] || "", images[1] || "", images[2] || "", images[3] || ""],
      sizes: product.sizes || [],
      features: (product.features || []).join("\n"),
      is_deal: product.is_deal || false,
      deal_price: product.deal_price?.toString() || "",
      deal_discount: product.deal_discount?.toString() || "",
    });
    setProductDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.stock) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setSavingProduct(true);

    // Filter out empty image URLs
    const validImages = productForm.images.filter(img => img.trim() !== "");
    const features = productForm.features.split("\n").filter(f => f.trim() !== "");

    const productData = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      category: productForm.category,
      description: productForm.description,
      stock: parseInt(productForm.stock),
      images: validImages.length > 0 ? validImages : null,
      sizes: productForm.sizes.length > 0 ? productForm.sizes : null,
      features: features.length > 0 ? features : null,
      is_deal: productForm.is_deal,
      deal_price: productForm.deal_price ? parseFloat(productForm.deal_price) : null,
      deal_discount: productForm.deal_discount ? parseInt(productForm.deal_discount) : null,
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
        toast({ title: "Success", description: "Product added successfully" });
      }

      setProductDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Product deleted successfully" });
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      toast({ title: "Success", description: "Order status updated" });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
      toast({ title: "Success", description: "Order deleted successfully" });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openAddReviewDialog = (productId?: string) => {
    setReviewForm({
      product_id: productId || "",
      reviewer_name: "",
      rating: "5",
      comment: "",
      is_verified: true,
      created_at: "",
    });
    setReviewDialogOpen(true);
  };

  const handleSaveReview = async () => {
    if (!reviewForm.product_id || !reviewForm.reviewer_name || !reviewForm.comment) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setSavingReview(true);

    try {
      const insertData: any = {
        product_id: reviewForm.product_id,
        reviewer_name: reviewForm.reviewer_name,
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment,
        is_verified: reviewForm.is_verified,
      };
      if (reviewForm.created_at) {
        insertData.created_at = new Date(reviewForm.created_at).toISOString();
      }
      const { error } = await supabase
        .from('product_reviews')
        .insert(insertData);

      if (error) throw error;
      
      // Update reviews count
      const product = products.find(p => p.id === reviewForm.product_id);
      if (product) {
        await supabase
          .from('products')
          .update({ reviews_count: (product.reviews_count || 0) + 1 })
          .eq('id', reviewForm.product_id);
      }

      toast({ title: "Success", description: "Review added successfully" });
      setReviewDialogOpen(false);
      fetchReviews();
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSavingReview(false);
    }
  };

  const handleDeleteReview = async (id: string, productId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update reviews count
      const product = products.find(p => p.id === productId);
      if (product && (product.reviews_count || 0) > 0) {
        await supabase
          .from('products')
          .update({ reviews_count: (product.reviews_count || 1) - 1 })
          .eq('id', productId);
      }

      toast({ title: "Success", description: "Review deleted successfully" });
      fetchReviews();
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (file: File, index: number) => {
    setUploadingImage(index);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const newImages = [...productForm.images];
      newImages[index] = publicUrl;
      setProductForm({ ...productForm, images: newImages });
      
      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(null);
    }
  };

  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    return lines.map(line => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
          inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += line[i];
        }
      }
      result.push(current.trim());
      return result;
    });
  };

  const downloadSampleCSV = () => {
    const sample = `name,price,category,stock,description,sizes,features,images,is_deal,deal_price,deal_discount
"Classic White T-Shirt",599,Clothing,50,"Premium cotton t-shirt","S,M,L,XL","100% Cotton|Comfortable fit|Machine washable","https://example.com/img1.jpg,https://example.com/img2.jpg",false,,
"Running Shoes Pro",2999,Footwear,30,"Lightweight running shoes","7,8,9,10,11","Breathable mesh|Anti-slip sole|Cushioned insole",,true,2499,17`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_products.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCSVUpload = async (file: File) => {
    setCsvUploading(true);
    setCsvResults(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      if (rows.length < 2) {
        throw new Error("CSV file must have a header row and at least one data row");
      }

      const headers = rows[0].map(h => h.toLowerCase().trim());
      const nameIdx = headers.indexOf('name');
      const priceIdx = headers.indexOf('price');
      const categoryIdx = headers.indexOf('category');
      const stockIdx = headers.indexOf('stock');
      const descIdx = headers.indexOf('description');
      const sizesIdx = headers.indexOf('sizes');
      const featuresIdx = headers.indexOf('features');
      const imagesIdx = headers.indexOf('images');
      const isDealIdx = headers.indexOf('is_deal');
      const dealPriceIdx = headers.indexOf('deal_price');
      const dealDiscountIdx = headers.indexOf('deal_discount');

      if (nameIdx === -1 || priceIdx === -1 || categoryIdx === -1 || stockIdx === -1) {
        throw new Error("CSV must have columns: name, price, category, stock");
      }

      let success = 0;
      const errors: string[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        try {
          const name = row[nameIdx]?.trim();
          const price = parseFloat(row[priceIdx]);
          const category = row[categoryIdx]?.trim();
          const stock = parseInt(row[stockIdx]);

          if (!name || isNaN(price) || !category || isNaN(stock)) {
            errors.push(`Row ${i + 1}: Missing required fields (name, price, category, stock)`);
            continue;
          }

          if (name.length > 200) {
            errors.push(`Row ${i + 1}: Name too long (max 200 chars)`);
            continue;
          }

          const validCategories = ["Audio", "Electronics", "Accessories", "Eyewear", "Footwear", "Clothing"];
          if (!validCategories.includes(category)) {
            errors.push(`Row ${i + 1}: Invalid category "${category}". Use: ${validCategories.join(', ')}`);
            continue;
          }

          const productData: any = {
            name,
            price,
            category,
            stock,
            description: descIdx !== -1 ? row[descIdx]?.trim() || null : null,
            sizes: sizesIdx !== -1 && row[sizesIdx]?.trim() ? row[sizesIdx].split(',').map(s => s.trim()) : null,
            features: featuresIdx !== -1 && row[featuresIdx]?.trim() ? row[featuresIdx].split('|').map(f => f.trim()) : null,
            images: imagesIdx !== -1 && row[imagesIdx]?.trim() ? row[imagesIdx].split(',').map(u => u.trim()) : null,
            is_deal: isDealIdx !== -1 ? row[isDealIdx]?.trim().toLowerCase() === 'true' : false,
            deal_price: dealPriceIdx !== -1 && row[dealPriceIdx]?.trim() ? parseFloat(row[dealPriceIdx]) : null,
            deal_discount: dealDiscountIdx !== -1 && row[dealDiscountIdx]?.trim() ? parseInt(row[dealDiscountIdx]) : null,
          };

          const { error } = await supabase.from('products').insert(productData);
          if (error) {
            errors.push(`Row ${i + 1} ("${name}"): ${error.message}`);
          } else {
            success++;
          }
        } catch (err: any) {
          errors.push(`Row ${i + 1}: ${err.message}`);
        }
      }

      setCsvResults({ success, errors });
      if (success > 0) fetchProducts();
      
      toast({
        title: `${success} product(s) uploaded`,
        description: errors.length > 0 ? `${errors.length} row(s) had errors` : "All products uploaded successfully!",
        variant: errors.length > 0 && success === 0 ? "destructive" : "default",
      });
    } catch (error: any) {
      toast({
        title: "CSV Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCsvUploading(false);
    }
  };

  const toggleSize = (size: string) => {
    setProductForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    revenue: orders.reduce((sum, order) => sum + Number(order.total), 0),
    totalReviews: reviews.length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Processing": return "bg-yellow-100 text-yellow-800";
      case "Pending": return "bg-gray-100 text-gray-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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

  return (
    <div className="min-h-screen bg-secondary/30">
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
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-3xl font-bold">{stats.totalReviews}</p>
              </div>
              <MessageSquare className="h-10 w-10 text-accent" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Messages
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
                <div className="flex gap-2">
                  {/* CSV Bulk Upload Dialog */}
                  <Dialog open={csvDialogOpen} onOpenChange={(open) => { setCsvDialogOpen(open); if (!open) setCsvResults(null); }}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Bulk CSV Upload
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Bulk Product Upload (CSV)</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                          Upload a CSV file to add multiple products at once. Required columns: <strong>name, price, category, stock</strong>.
                        </p>
                        <div className="bg-secondary/50 rounded-lg p-3 text-xs space-y-1">
                          <p className="font-semibold text-sm mb-2">CSV Format Guide:</p>
                          <p><strong>name</strong> — Product name (required)</p>
                          <p><strong>price</strong> — Price in ₹ (required)</p>
                          <p><strong>category</strong> — Audio, Electronics, Accessories, Eyewear, Footwear, Clothing (required)</p>
                          <p><strong>stock</strong> — Stock quantity (required)</p>
                          <p><strong>description</strong> — Product description</p>
                          <p><strong>sizes</strong> — Comma-separated: S,M,L,XL</p>
                          <p><strong>features</strong> — Pipe-separated: Feature1|Feature2|Feature3</p>
                          <p><strong>images</strong> — Comma-separated URLs</p>
                          <p><strong>is_deal</strong> — true/false</p>
                          <p><strong>deal_price, deal_discount</strong> — Deal pricing</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={downloadSampleCSV} className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download Sample CSV
                        </Button>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept=".csv"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleCSVUpload(file);
                                e.target.value = '';
                              }}
                              disabled={csvUploading}
                            />
                            {csvUploading ? (
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                                <p className="text-sm text-muted-foreground">Uploading products...</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <p className="text-sm font-medium">Click to select CSV file</p>
                                <p className="text-xs text-muted-foreground">Only .csv files supported</p>
                              </div>
                            )}
                          </label>
                        </div>
                        {csvResults && (
                          <div className="space-y-2">
                            {csvResults.success > 0 && (
                              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">{csvResults.success} product(s) added successfully!</span>
                              </div>
                            )}
                            {csvResults.errors.length > 0 && (
                              <div className="bg-destructive/10 p-3 rounded-lg space-y-1">
                                <div className="flex items-center gap-2 text-destructive">
                                  <AlertCircle className="h-4 w-4" />
                                  <span className="text-sm font-medium">{csvResults.errors.length} error(s):</span>
                                </div>
                                <div className="max-h-32 overflow-y-auto">
                                  {csvResults.errors.map((err, i) => (
                                    <p key={i} className="text-xs text-destructive/80">{err}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={openAddProductDialog}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="productName">Product Name *</Label>
                        <Input
                          id="productName"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="productPrice">Price (₹) *</Label>
                          <Input
                            id="productPrice"
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            placeholder="Enter price"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="productStock">Stock *</Label>
                          <Input
                            id="productStock"
                            type="number"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                            placeholder="Enter stock"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productCategory">Category *</Label>
                        <Select
                          value={productForm.category}
                          onValueChange={(value) => setProductForm({ ...productForm, category: value, sizes: [] })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Sizes for Clothing/Footwear */}
                      {(productForm.category === "Clothing" || productForm.category === "Footwear") && (
                        <div className="space-y-2">
                          <Label>Available Sizes</Label>
                          <div className="flex flex-wrap gap-2">
                            {(productForm.category === "Clothing" ? clothingSizes : shoeSizes).map((size) => (
                              <Button
                                key={size}
                                type="button"
                                variant={productForm.sizes.includes(size) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleSize(size)}
                              >
                                {size}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="productDescription">Description</Label>
                        <Textarea
                          id="productDescription"
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          placeholder="Enter product description"
                          rows={3}
                        />
                      </div>

                      {/* Images */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          Product Images (Upload or URL)
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          {productForm.images.map((img, index) => (
                            <div key={index} className="space-y-2 border border-border rounded-lg p-3">
                              <div className="flex gap-2">
                                <Input
                                  value={img}
                                  onChange={(e) => {
                                    const newImages = [...productForm.images];
                                    newImages[index] = e.target.value;
                                    setProductForm({ ...productForm, images: newImages });
                                  }}
                                  placeholder={`Image URL ${index + 1}`}
                                  className="flex-1 text-xs"
                                />
                                <label className="cursor-pointer">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleImageUpload(file, index);
                                    }}
                                  />
                                  <Button type="button" variant="outline" size="icon" asChild disabled={uploadingImage === index}>
                                    <span>
                                      {uploadingImage === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                    </span>
                                  </Button>
                                </label>
                              </div>
                              {img ? (
                                <div className="relative group">
                                  <img src={img} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-md border border-border" />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-1 right-1 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                      const newImages = [...productForm.images];
                                      newImages[index] = "";
                                      setProductForm({ ...productForm, images: newImages });
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                  <span className="absolute bottom-1 left-1 bg-background/80 text-[10px] px-1.5 py-0.5 rounded text-foreground">Image {index + 1}</span>
                                </div>
                              ) : (
                                <div className="w-full h-32 bg-secondary/50 rounded-md border border-dashed border-border flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">No image {index + 1}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">Upload images or paste URLs. Up to 4 images supported.</p>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <Label htmlFor="productFeatures">Key Features (one per line)</Label>
                        <Textarea
                          id="productFeatures"
                          value={productForm.features}
                          onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                          rows={4}
                        />
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-4">
                          <input
                            type="checkbox"
                            id="isDeal"
                            checked={productForm.is_deal}
                            onChange={(e) => setProductForm({ ...productForm, is_deal: e.target.checked })}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="isDeal">Mark as Special Deal</Label>
                        </div>
                        {productForm.is_deal && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="dealPrice">Deal Price (₹)</Label>
                              <Input
                                id="dealPrice"
                                type="number"
                                value={productForm.deal_price}
                                onChange={(e) => setProductForm({ ...productForm, deal_price: e.target.value })}
                                placeholder="Sale price"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="dealDiscount">Discount %</Label>
                              <Input
                                id="dealDiscount"
                                type="number"
                                value={productForm.deal_discount}
                                onChange={(e) => setProductForm({ ...productForm, deal_discount: e.target.value })}
                                placeholder="e.g., 25"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleSaveProduct} disabled={savingProduct} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          {savingProduct ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                        </Button>
                        <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Stock</th>
                      <th className="text-left py-3 px-4">Reviews</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          No products found. Add your first product!
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-secondary/50">
                          <td className="py-3 px-4">
                            <span className="font-medium">{product.name}</span>
                          </td>
                          <td className="py-3 px-4">{product.category}</td>
                          <td className="py-3 px-4">₹{Number(product.price).toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-sm ${product.stock < 30 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {product.stock} units
                            </span>
                          </td>
                          <td className="py-3 px-4">{product.reviews_count || 0}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openAddReviewDialog(product.id)} title="Add Review">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openEditProductDialog(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
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
              </div>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">No orders yet.</p>
                ) : (
                  orders.map((order) => {
                    const orderItems = Array.isArray(order.items) ? order.items : [];
                    return (
                      <Card key={order.id} className="p-5 border">
                        {/* Order Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-mono text-sm font-bold">{order.order_number}</p>
                            <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>{order.status}</span>
                            <span className={`px-2 py-1 rounded text-xs ${order.payment_method === 'cod' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                              {order.payment_method === 'cod' ? 'COD' : 'Paid Online'}
                            </span>
                          </div>
                        </div>

                        {/* Delivery Label Style - Customer Details */}
                        <div className="bg-secondary/50 rounded-lg p-4 mb-4 border border-dashed border-border">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Deliver To</p>
                          <p className="font-bold text-lg">{order.customer_name}</p>
                          <p className="text-sm">{order.customer_address}</p>
                          <p className="text-sm">{order.customer_city}, {order.customer_state} - {order.customer_pincode}</p>
                          <p className="text-sm font-medium mt-1">📞 {order.customer_phone}</p>
                        </div>

                        {/* Order Items */}
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Items</p>
                          <div className="space-y-1">
                            {orderItems.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>
                                  {item.name} × {item.quantity}
                                  {item.size && <span className="ml-1 text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded">Size: {item.size}</span>}
                                </span>
                                <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                            <span>Total</span>
                            <span>₹{Number(order.total).toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Processing">Processing</SelectItem>
                              <SelectItem value="Shipped">Shipped</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteOrder(order.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Reviews Management</h2>
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openAddReviewDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Review</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Select Product *</Label>
                        <Select
                          value={reviewForm.product_id}
                          onValueChange={(value) => setReviewForm({ ...reviewForm, product_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reviewerName">Reviewer Name *</Label>
                        <Input
                          id="reviewerName"
                          value={reviewForm.reviewer_name}
                          onChange={(e) => setReviewForm({ ...reviewForm, reviewer_name: e.target.value })}
                          placeholder="e.g., Rahul Sharma"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Rating *</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((r) => (
                            <Button
                              key={r}
                              type="button"
                              variant={reviewForm.rating === String(r) ? "default" : "outline"}
                              size="icon"
                              onClick={() => setReviewForm({ ...reviewForm, rating: String(r) })}
                            >
                              <Star className={`h-4 w-4 ${reviewForm.rating >= String(r) ? 'fill-current' : ''}`} />
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reviewComment">Comment *</Label>
                        <Textarea
                          id="reviewComment"
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          placeholder="Write a review..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reviewDate">Review Date (optional - leave blank for now)</Label>
                        <Input
                          id="reviewDate"
                          type="datetime-local"
                          value={reviewForm.created_at}
                          onChange={(e) => setReviewForm({ ...reviewForm, created_at: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Set a custom date/time for the review. Leave blank for current time.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isVerified"
                          checked={reviewForm.is_verified}
                          onChange={(e) => setReviewForm({ ...reviewForm, is_verified: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="isVerified">Verified Purchase</Label>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleSaveReview} disabled={savingReview} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          {savingReview ? "Saving..." : "Add Review"}
                        </Button>
                        <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Reviewer</th>
                      <th className="text-left py-3 px-4">Rating</th>
                      <th className="text-left py-3 px-4">Comment</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          No reviews yet. Add your first review!
                        </td>
                      </tr>
                    ) : (
                      reviews.map((review) => {
                        const product = products.find(p => p.id === review.product_id);
                        return (
                          <tr key={review.id} className="border-b hover:bg-secondary/50">
                            <td className="py-3 px-4">{product?.name || "Unknown"}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span>{review.reviewer_name}</span>
                                {review.is_verified && (
                                  <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">Verified</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 max-w-xs truncate">{review.comment}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString('en-IN')}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteReview(review.id, review.product_id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
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
                <p className="text-sm text-muted-foreground">Mark products as deals from the Products tab</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Original Price</th>
                      <th className="text-left py-3 px-4">Deal Price</th>
                      <th className="text-left py-3 px-4">Discount</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter(p => p.is_deal).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No active deals. Mark products as deals from the Products tab.
                        </td>
                      </tr>
                    ) : (
                      products.filter(p => p.is_deal).map((product) => (
                        <tr key={product.id} className="border-b hover:bg-secondary/50">
                          <td className="py-3 px-4 font-medium">{product.name}</td>
                          <td className="py-3 px-4 line-through text-muted-foreground">₹{Number(product.price).toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 font-bold text-accent">₹{Number(product.deal_price || product.price).toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4">
                            <span className="bg-accent/20 text-accent px-2 py-1 rounded font-bold">
                              {product.deal_discount || 0}% OFF
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="icon" onClick={() => openEditProductDialog(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Settings</h2>
              <div className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium mb-2">Admin Account</h3>
                  <p className="text-sm text-muted-foreground">Email: {user.email}</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium mb-2">Store Information</h3>
                  <p className="text-sm text-muted-foreground">Store Name: ZenViero</p>
                  <p className="text-sm text-muted-foreground">Products: {stats.totalProducts}</p>
                  <p className="text-sm text-muted-foreground">Orders: {stats.totalOrders}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Contact Messages ({contactMessages.length})</h2>
              <Button variant="outline" size="sm" onClick={fetchContactMessages}>Refresh</Button>
            </div>
            {contactMessages.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {contactMessages.map((msg) => (
                  <Card key={msg.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-sm">{msg.name}</p>
                          <a href={`mailto:${msg.email}`} className="text-xs text-accent hover:underline">{msg.email}</a>
                        </div>
                        <p className="font-medium text-sm">{msg.subject}</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
                        <p className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString("en-IN")}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteContactMessage(msg.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
