import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/formatPrice";

const statusSteps = ["Pending", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Pending": return <Clock className="h-5 w-5" />;
    case "Confirmed": return <CheckCircle className="h-5 w-5" />;
    case "Shipped": return <Package className="h-5 w-5" />;
    case "Out for Delivery": return <Truck className="h-5 w-5" />;
    case "Delivered": return <CheckCircle className="h-5 w-5" />;
    default: return <Clock className="h-5 w-5" />;
  }
};

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

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      toast({ title: "Please fill both fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    setSearched(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber.trim())
      .eq("customer_phone", phone.trim())
      .maybeSingle();

    setLoading(false);
    if (error || !data) {
      setOrder(null);
      toast({ title: "Order not found", description: "Please check your order number and phone number.", variant: "destructive" });
    } else {
      setOrder(data);
    }
  };

  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;
  const items = order?.items as any[] || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Order</h1>
          <p className="text-muted-foreground mb-8">Enter your order number and phone number to track your order.</p>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleTrack} className="space-y-4">
                <div>
                  <Label htmlFor="orderNumber">Order Number</Label>
                  <Input id="orderNumber" placeholder="e.g. ORD-1234567890" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? "Searching..." : "Track Order"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {searched && order && (
            <div className="space-y-6 animate-in fade-in-50">
              {/* Status Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Order #{order.order_number}</span>
                    <Badge className={`${getStatusColor(order.status)} text-primary-foreground`}>{order.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {order.status === "Cancelled" ? (
                    <p className="text-destructive font-medium">This order has been cancelled.</p>
                  ) : (
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                      <div className="absolute top-5 left-0 h-0.5 bg-accent transition-all" style={{ width: `${Math.max(0, currentStepIndex / (statusSteps.length - 1)) * 100}%` }} />
                      {statusSteps.map((step, i) => (
                        <div key={step} className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= currentStepIndex ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                            {getStatusIcon(step)}
                          </div>
                          <span className={`text-xs mt-2 text-center max-w-[70px] ${i <= currentStepIndex ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Details */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Delivery Details</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><span>{order.customer_name}</span></div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{order.customer_phone}</span></div>
                  <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /><span>{order.customer_address}, {order.customer_city}, {order.customer_state} - {order.customer_pincode}</span></div>
                </CardContent>
              </Card>

              {/* Items */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Order Items</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover" />}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 border-t font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {searched && !order && !loading && (
            <Card><CardContent className="py-12 text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No order found</p>
              <p className="text-sm">Double-check your order number and phone number.</p>
            </CardContent></Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrackOrder;
