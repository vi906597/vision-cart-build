import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  ShoppingCart, 
  Tag, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  TrendingUp,
  DollarSign,
  Eye
} from "lucide-react";
import logo from "@/assets/logo.png";
import productHeadphones from "@/assets/product-headphones.jpg";
import productBag from "@/assets/product-bag.jpg";
import productPhone from "@/assets/product-phone.jpg";
import productSunglasses from "@/assets/product-sunglasses.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";

// Sample data for demonstration
const initialProducts = [
  { id: 1, name: "Premium Wireless Headphones", price: 299.99, stock: 45, category: "Audio", image: productHeadphones },
  { id: 2, name: "Luxury Leather Bag", price: 449.99, stock: 23, category: "Accessories", image: productBag },
  { id: 3, name: "Modern Smartphone", price: 899.99, stock: 67, category: "Electronics", image: productPhone },
  { id: 4, name: "Designer Sunglasses", price: 249.99, stock: 89, category: "Eyewear", image: productSunglasses },
  { id: 5, name: "Athletic Sneakers", price: 179.99, stock: 112, category: "Footwear", image: productSneakers },
];

const initialOrders = [
  { id: "ORD001", customer: "Rahul Sharma", total: 599.98, status: "Delivered", date: "2025-02-01", items: 2 },
  { id: "ORD002", customer: "Priya Patel", total: 449.99, status: "Shipped", date: "2025-02-02", items: 1 },
  { id: "ORD003", customer: "Amit Kumar", total: 1149.98, status: "Processing", date: "2025-02-03", items: 3 },
  { id: "ORD004", customer: "Sneha Gupta", total: 179.99, status: "Pending", date: "2025-02-03", items: 1 },
  { id: "ORD005", customer: "Vikram Singh", total: 749.98, status: "Delivered", date: "2025-01-30", items: 2 },
];

const initialDeals = [
  { id: 1, product: "Modern Smartphone", discount: 28, originalPrice: 899.99, salePrice: 649.99, active: true },
  { id: 2, product: "Athletic Sneakers", discount: 28, originalPrice: 179.99, salePrice: 129.99, active: true },
  { id: 3, product: "Luxury Leather Bag", discount: 33, originalPrice: 449.99, salePrice: 299.99, active: true },
];

const AdminPanel = () => {
  const [products, setProducts] = useState(initialProducts);
  const [orders] = useState(initialOrders);
  const [deals, setDeals] = useState(initialDeals);
  const [editingProduct, setEditingProduct] = useState<typeof initialProducts[0] | null>(null);

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

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="ZenViero" className="h-8" />
            <span className="text-lg font-semibold text-muted-foreground">Admin Panel</span>
          </div>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            <Eye className="h-4 w-4 mr-2" />
            View Store
          </Button>
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
                <p className="text-3xl font-bold">${stats.revenue.toFixed(2)}</p>
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
                        <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${product.stock < 30 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
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
                        <td className="py-3 px-4 font-semibold">${order.total.toFixed(2)}</td>
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
                        <td className="py-3 px-4 text-muted-foreground line-through">${deal.originalPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 font-semibold text-accent">${deal.salePrice.toFixed(2)}</td>
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
                  <Input id="currency" defaultValue="USD ($)" />
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