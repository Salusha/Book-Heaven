import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

interface CheckoutItem {
  _id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    title: string;
    author: string;
    coverImage: string;
    price: number;
  };
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { items: CheckoutItem[]; total: number } | undefined;

  const items = state?.items ?? [];
  const total = state?.total ?? 0;

  const handlePlaceOrder = () => {
    toast({ title: "Checkout", description: "Order placement flow not yet implemented." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="flex items-center justify-between mb-8 gap-3 sm:gap-6 flex-col sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold mb-1">Checkout</h1>
            <p className="text-muted-foreground">Review your items before placing the order.</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Back to cart</Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Your checkout session is empty.</p>
            <Link to="/cart">
              <Button>Return to Cart</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item._id}>
                  <CardContent className="flex gap-4 p-4 items-center">
                    <img
                      src={item.product.coverImage}
                      alt={item.product.title}
                      className="h-24 w-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-semibold line-clamp-1">{item.product.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">by {item.product.author}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right font-semibold whitespace-nowrap pl-2">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="lg:sticky top-6 self-start shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Order Summary</CardTitle>
                <CardDescription>Confirm your items and total.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 pt-0 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-base text-muted-foreground">Items</span>
                  <span className="text-lg font-semibold">{items.length}</span>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-2xl font-semibold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                  <Button className="w-full" size="lg" onClick={handlePlaceOrder}>
                    Place Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
