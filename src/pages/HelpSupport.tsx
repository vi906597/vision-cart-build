import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Truck, RotateCcw, CreditCard, ShieldCheck, MessageCircle, Send, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  { q: "How can I track my order?", a: "Go to our Track Order page, enter your order number and registered phone number to see real-time status updates." },
  { q: "What are the shipping charges?", a: "We offer free shipping on orders above ₹999. For orders below ₹999, a flat shipping fee of ₹79 is applicable." },
  { q: "How long does delivery take?", a: "Standard delivery takes 5-7 business days. Metro cities may receive orders within 3-5 business days." },
  { q: "What is your return policy?", a: "We accept returns within 7 days of delivery. The product must be unused, unwashed, and in its original packaging with tags attached." },
  { q: "How do I initiate a return?", a: "Contact us via email or phone with your order number. Our team will guide you through the return process and arrange a pickup." },
  { q: "What payment methods do you accept?", a: "We accept UPI, Credit/Debit Cards, Net Banking via Razorpay, and Cash on Delivery (COD)." },
  { q: "Is Cash on Delivery available?", a: "Yes, COD is available for most pin codes across India." },
  { q: "Can I cancel my order?", a: "Orders can be cancelled before they are shipped. Once shipped, you'll need to wait for delivery and then initiate a return." },
];

const HelpSupport = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    });
    setSending(false);
    if (error) {
      toast({ title: "Failed to send message", description: "Please try again later.", variant: "destructive" });
    } else {
      setSent(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Help & Support</h1>
          <p className="text-muted-foreground mb-10">We're here to help. Find answers to common questions or reach out to us.</p>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Truck, label: "Track Order", href: "/track-order" },
              { icon: RotateCcw, label: "Returns", href: "#returns" },
              { icon: CreditCard, label: "Payments", href: "#payments" },
              { icon: ShieldCheck, label: "Order History", href: "/order-history" },
            ].map((item) => (
              <Link key={item.label} to={item.href}>
                <Card className="text-center hover:border-accent transition-colors cursor-pointer h-full">
                  <CardContent className="pt-6 pb-4 flex flex-col items-center gap-2">
                    <item.icon className="h-6 w-6 text-accent" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* FAQ */}
          <Card className="mb-10">
            <CardHeader><CardTitle>Frequently Asked Questions</CardTitle></CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-sm">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader><CardTitle>Contact Us</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/10"><Mail className="h-5 w-5 text-accent" /></div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a href="mailto:support@zenviero.com" className="text-sm text-muted-foreground hover:text-accent">support@zenviero.com</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/10"><Phone className="h-5 w-5 text-accent" /></div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <a href="tel:+919876543210" className="text-sm text-muted-foreground hover:text-accent">+91 98765 43210</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/10"><MessageCircle className="h-5 w-5 text-accent" /></div>
                    <div>
                      <p className="text-sm font-medium">WhatsApp</p>
                      <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-accent">Chat with us</a>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/10"><Clock className="h-5 w-5 text-accent" /></div>
                    <div>
                      <p className="text-sm font-medium">Working Hours</p>
                      <p className="text-sm text-muted-foreground">Mon - Sat: 10 AM - 7 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/10"><MapPin className="h-5 w-5 text-accent" /></div>
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">ZenViero, Mumbai, Maharashtra, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HelpSupport;
