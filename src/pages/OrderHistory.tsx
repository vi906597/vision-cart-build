import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/formatPrice";
import { Link } from "react-router-dom";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending": return "bg-yellow-500";
    case "Confirmed": return "bg-blue-500";
    case "Shipped": return "bg-purple-500";
    case "Out for Delivery": return "bg-orange-500";
    case "Delivered": return "bg-green-500";
    case "Cancelled": return "bg-destructive";
    default: return "bg-muted";
  }
};

const OrderHistory = () => {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast({ title: "Please enter your phone number", variant: "destructive" });
      return;
    }

    setLoading(true);
    setSearched(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_phone", phone.trim())
      .order("created_at", { ascending: false });

    setLoading(false);
    if (error) {
      toast({ title: "Error fetching orders", variant: "destructive" });
      return;
    }
    setOrders(data || []);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Order History</h1>
          <p className="text-muted-foreground mb-8">View all your past orders by entering your phone number.</p>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="phone" className="sr-only">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <Button type="submit" disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? "Searching..." : "Search"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {searched && orders.length > 0 && (
            <div className="space-y-4 animate-in fade-in-50">
              <p className="text-sm text-muted-foreground">{orders.length} order(s) found</p>
              {orders.map((order) => {
                const items = order.items as any[] || [];
                const isExpanded = expandedOrder === order.id;
                return (
                  <Card key={order.id} className="overflow-hidden">
                    <button className="w-full text-left" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-2">
                        <div>
                          <CardTitle className="text-base">#{order.order_number}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <Badge className={`${getStatusColor(order.status)} text-primary-foreground text-xs`}>{order.status}</Badge>
                          <span className="font-semibold text-sm">{formatPrice(order.total)}</span>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </CardHeader>
                    </button>
                    {isExpanded && (
                      <CardContent className="pt-0 border-t">
                        <div className="space-y-3 pt-4">
                          {items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3">
                              {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />}
                              <div className="flex-1">
                                <p className="text-sm font-medium">{item.name}</p>
                                {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          ))}
                          <div className="flex justify-between pt-3 border-t text-sm">
                            <span className="text-muted-foreground">Payment: {order.payment_method}</span>
                            <Link to={`/track-order`} className="text-accent hover:underline text-sm font-medium">Track this order →</Link>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {searched && orders.length === 0 && !loading && (
            <Card><CardContent className="py-12 text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm">No orders found for this phone number.</p>
            </CardContent></Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;
