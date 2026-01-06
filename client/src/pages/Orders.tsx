import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader, Package, ArrowRight } from "lucide-react";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  orderItems: OrderItem[];
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || "";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/orders`, {
          headers: { "auth-token": token },
        });

        const ordersData = res.data?.orders || res.data?.data?.orders || [];
        setOrders(ordersData);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate, apiBaseUrl]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!token) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-2">
            <Loader className="h-5 w-5 animate-spin" />
            <p>Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            Track and manage all your orders in one place
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders. Start shopping to see them here.
            </p>
            <Button onClick={() => navigate("/browse")}>
              Browse Books
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {order.orderStatus || "Processing"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 pb-4 border-b">
                    {order.orderItems?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      ₹{order.totalPrice?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  {/* Action */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
