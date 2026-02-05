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
   X
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
   customer_city: string;
   customer_state: string;
   items: any;
   total: number;
   status: string;
   payment_method: string;
   created_at: string;
 }
 
 const categories = ["Audio", "Electronics", "Accessories", "Eyewear", "Footwear", "Clothing"];
 
 const AdminPanel = () => {
   const [products, setProducts] = useState<Product[]>([]);
   const [orders, setOrders] = useState<Order[]>([]);
   const [user, setUser] = useState<User | null>(null);
   const [session, setSession] = useState<Session | null>(null);
   const [isAdmin, setIsAdmin] = useState(false);
   const [loading, setLoading] = useState(true);
   const [authLoading, setAuthLoading] = useState(false);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [productDialogOpen, setProductDialogOpen] = useState(false);
   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
   const [productForm, setProductForm] = useState({
     name: "",
     price: "",
     category: "",
     description: "",
     stock: "",
     is_deal: false,
     deal_price: "",
     deal_discount: "",
   });
   const [savingProduct, setSavingProduct] = useState(false);
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
 
   useEffect(() => {
     if (isAdmin) {
       fetchProducts();
       fetchOrders();
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
       is_deal: false,
       deal_price: "",
       deal_discount: "",
     });
     setProductDialogOpen(true);
   };
 
   const openEditProductDialog = (product: Product) => {
     setEditingProduct(product);
     setProductForm({
       name: product.name,
       price: product.price.toString(),
       category: product.category,
       description: product.description || "",
       stock: product.stock.toString(),
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
 
     const productData = {
       name: productForm.name,
       price: parseFloat(productForm.price),
       category: productForm.category,
       description: productForm.description,
       stock: parseInt(productForm.stock),
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
 
   const handleToggleDeal = async (product: Product) => {
     try {
       const { error } = await supabase
         .from('products')
         .update({ is_deal: !product.is_deal })
         .eq('id', product.id);
 
       if (error) throw error;
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
 
   const stats = {
     totalProducts: products.length,
     totalOrders: orders.length,
     revenue: orders.reduce((sum, order) => sum + Number(order.total), 0),
     activeDeals: products.filter(p => p.is_deal).length,
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
                 <p className="text-sm text-muted-foreground">Active Deals</p>
                 <p className="text-3xl font-bold">{stats.activeDeals}</p>
               </div>
               <TrendingUp className="h-10 w-10 text-accent" />
             </div>
           </Card>
         </div>
 
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
 
           <TabsContent value="products">
             <Card className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-semibold">Products Management</h2>
                 <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                   <DialogTrigger asChild>
                     <Button onClick={openAddProductDialog}>
                       <Plus className="h-4 w-4 mr-2" />
                       Add Product
                     </Button>
                   </DialogTrigger>
                   <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
                           onValueChange={(value) => setProductForm({ ...productForm, category: value })}
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
               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead>
                     <tr className="border-b">
                       <th className="text-left py-3 px-4">Product</th>
                       <th className="text-left py-3 px-4">Category</th>
                       <th className="text-left py-3 px-4">Price</th>
                       <th className="text-left py-3 px-4">Stock</th>
                       <th className="text-left py-3 px-4">Deal</th>
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
                           <td className="py-3 px-4">
                             <span className={`px-2 py-1 rounded text-sm ${product.is_deal ? 'bg-accent/20 text-accent' : 'bg-gray-100 text-gray-600'}`}>
                               {product.is_deal ? `${product.deal_discount}% OFF` : 'No Deal'}
                             </span>
                           </td>
                           <td className="py-3 px-4 text-right">
                             <div className="flex justify-end gap-2">
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
 
           <TabsContent value="orders">
             <Card className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-semibold">Orders Management</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead>
                     <tr className="border-b">
                       <th className="text-left py-3 px-4">Order ID</th>
                       <th className="text-left py-3 px-4">Customer</th>
                       <th className="text-left py-3 px-4">Location</th>
                       <th className="text-left py-3 px-4">Total</th>
                       <th className="text-left py-3 px-4">Payment</th>
                       <th className="text-left py-3 px-4">Status</th>
                       <th className="text-right py-3 px-4">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {orders.length === 0 ? (
                       <tr>
                         <td colSpan={7} className="py-8 text-center text-muted-foreground">
                           No orders yet.
                         </td>
                       </tr>
                     ) : (
                       orders.map((order) => (
                         <tr key={order.id} className="border-b hover:bg-secondary/50">
                           <td className="py-3 px-4 font-mono text-sm">{order.order_number}</td>
                           <td className="py-3 px-4">
                             <div>
                               <p className="font-medium">{order.customer_name}</p>
                               <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                             </div>
                           </td>
                           <td className="py-3 px-4 text-sm">{order.customer_city}, {order.customer_state}</td>
                           <td className="py-3 px-4 font-semibold">₹{Number(order.total).toLocaleString('en-IN')}</td>
                           <td className="py-3 px-4">
                             <span className={`px-2 py-1 rounded text-xs ${order.payment_method === 'cod' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                               {order.payment_method === 'cod' ? 'COD' : 'Paid'}
                             </span>
                           </td>
                           <td className="py-3 px-4">
                             <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                               {order.status}
                             </span>
                           </td>
                           <td className="py-3 px-4 text-right">
                             <Select
                               value={order.status}
                               onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                             >
                               <SelectTrigger className="w-32">
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
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
             </Card>
           </TabsContent>
 
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
                       <th className="text-left py-3 px-4">Sale Price</th>
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
                           <td className="py-3 px-4 text-muted-foreground line-through">₹{Number(product.price).toLocaleString('en-IN')}</td>
                           <td className="py-3 px-4 font-semibold text-accent">₹{Number(product.deal_price || product.price).toLocaleString('en-IN')}</td>
                           <td className="py-3 px-4">
                             <span className="bg-accent/20 text-accent px-2 py-1 rounded font-semibold">
                               {product.deal_discount || 0}% OFF
                             </span>
                           </td>
                           <td className="py-3 px-4 text-right">
                             <Button variant="outline" size="sm" onClick={() => handleToggleDeal(product)}>
                               Remove Deal
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