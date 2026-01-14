import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import BookCard from "@/components/BookCard";
import { Book } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

interface CartItem {
  _id: string;
  productId: string;
  product: Book;
  price: number;
  quantity: number;
}

const Cart = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isInCart, removeFromCart, updateQuantity, refreshCart } = useCart();

  const mapProductToBook = (product: any): Book => ({
    _id: product._id,
    title: product.name || "Untitled",
    author: product.author || "Unknown author",
    description: product.description || "No description available.",
    price: Number(product.price) || 0,
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    rating: typeof product.ratings === "number" ? product.ratings : 0,
    reviewCount: product.numOfReviews ?? 0,
    category: product.category || "General",
    isbn: product.isbn || product._id || "N/A",
    publisher: product.publisher || "Book Heaven",
    publishedDate: product.publishedDate || product.createdAt || new Date().toISOString(),
    pages: product.pages || 0,
    language: product.language || "English",
    coverImage: product.images?.[0]?.url || "/placeholder.svg",
    inStock: product.Stock ? product.Stock > 0 : true,
    stockQuantity: product.Stock || 0,
    featured: Boolean(product.featured),
    bestseller: Boolean(product.bestseller),
    newRelease: Boolean(product.newRelease),
  });

  const handleRemoveItem = async (productId: string) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    try {
      setRemoving(productId);
      await axios.post(`${apiBaseUrl}/api/cart/remove-product`, {
        productId,
      }, {
        headers: { "auth-token": token },
      });
      
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      removeFromCart(productId);
      toast({ title: "Removed from cart" });
    } catch (err: any) {
      // console.error("Failed to remove item:", err);
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setRemoving(null);
    }
  };

  // useEffect(() => {
  //   const fetchCart = async () => {
  //     try {
  //       const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  //       const res = await axios.get("/customer/cart", {
  //         headers: {
  //           "auth-token": token,
  //         },
  //       });

  //       setCartItems(res.data.cart || []);
  //     } catch (err) {
  //       console.error("Failed to fetch cart:", err);
  //       setCartItems([]);
  //     } finally {
  //       setTimeout(() => setLoading(false), 400); // Delay to smooth appearance
  //     }
  //   };

  //   fetchCart();
  // }, []);
 useEffect(() => {
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        setCartItems([]);
        setLoading(false);
        return;
      }

      const res = await axios.get(`${apiBaseUrl}/api/cart`, {
        headers: {
          "auth-token": token,
        },
      });

      console.log("Cart API Response:", res.data);
      console.log("Cart Items Array:", res.data.cartItems);

      if (!res.data.cartItems || res.data.cartItems.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const transformed = res.data.cartItems
        .map((item: any) => {
          console.log("Mapping item:", item);
          if (!item.product) {
            console.warn("Item has no product field:", item);
            return null;
          }
          const product = mapProductToBook(item.product);
          // Override price with cart item price if present
          const pricedProduct: Book = { ...product, price: item.price ?? product.price };
          return {
            _id: item.product._id || item._id,
            productId: item.product._id,
            product: pricedProduct,
            price: item.price ?? product.price,
            quantity: 1,
          } as CartItem;
        })
        .filter(Boolean) as CartItem[]; // remove nulls

      // Group items by productId and aggregate quantities
      const groupedItems = Array.from(
        transformed.reduce((map, item) => {
          const existing = map.get(item.productId);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            map.set(item.productId, { ...item });
          }
          return map;
        }, new Map<string, CartItem>()).values()
      );

      console.log("Transformed cart items:", groupedItems);
      setCartItems(groupedItems);
    } catch (err: any) {
      console.error("Failed to fetch cart:", err);
      setCartItems([]);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  fetchCart();
}, []);



  const visibleItems = useMemo(() => cartItems.filter(item => isInCart(item.productId)), [cartItems, isInCart]);

  const totalAmount = visibleItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      toast({ title: "Login required", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (visibleItems.length === 0) {
      toast({ title: "Your cart is empty", variant: "destructive" });
      return;
    }
    navigate("/checkout", { state: { items: visibleItems, total: totalAmount } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {(!loading && visibleItems.length === 0) && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Your Cart</h1>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Review your selected books and proceed to checkout.
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center text-muted-foreground">Loading your cart...</div>
        ) : (
          <div className="animate-fade-in">
            {visibleItems.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted-foreground mb-6">Your cart is empty.</p>
                <Link to="/browse">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="text-left">
                  <h2 className="text-2xl font-bold mb-6">Your Cart Items</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {visibleItems.map((item) => (
                      <div key={item._id} className="max-w-sm">
                        <BookCard 
                          book={item.product}
                          quantity={item.quantity}
                          maxQuantity={item.product.stockQuantity || 1}
                          onQuantityChange={async (newQuantity) => {
                            if (newQuantity < 1) return;
                            const prevQty = item.quantity;
                            const diff = newQuantity - prevQty;

                            // optimistic UI update
                            setCartItems((prev) =>
                              prev.map((i) =>
                                i._id === item._id
                                  ? { ...i, quantity: newQuantity }
                                  : i
                              )
                            );
                            updateQuantity(item.productId, newQuantity);

                            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                            if (!token) {
                              toast({ title: "Login required", variant: "destructive" });
                              return;
                            }

                            try {
                              if (diff > 0) {
                                const cartItems = Array.from({ length: diff }, () => ({
                                  product: item.productId,
                                  price: item.price,
                                }));
                                await axios.post(`${apiBaseUrl}/api/cart`, { cartItems }, {
                                  headers: { "auth-token": token },
                                });
                              } else if (diff < 0) {
                                const removeCount = Math.abs(diff);
                                for (let i = 0; i < removeCount; i++) {
                                  await axios.post(`${apiBaseUrl}/api/cart/remove-product`, { productId: item.productId }, {
                                    headers: { "auth-token": token },
                                  });
                                }
                              }
                              await refreshCart();
                            } catch (err: any) {
                              console.error("Failed to update quantity:", err);
                              toast({ title: "Cart error", variant: "destructive" });
                              await refreshCart();
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="max-w-xl mx-auto text-center">
                  <p className="text-xl font-semibold mb-4">
                    Total: ₹{totalAmount.toFixed(2)}
                  </p>
                  <Button size="lg" className="w-full" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ShoppingCart, Trash2 } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { Link } from "react-router-dom";

// interface CartItem {
//   _id: string;
//   title: string;
//   author: string;
//   price: number;
//   quantity: number;
//   image?: string;
// }

// const Cart = () => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//         const res = await axios.get("/api/cart", {
//           headers: {
//             "auth-token": token,
//           },
//         });

//         // Assuming response format is { cart: [...] }
//         setCartItems(res.data.cart || []);
//       } catch (err) {
//         console.error("Failed to fetch cart:", err);
//         setCartItems([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCart();
//   }, []);

//   const totalAmount = cartItems.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="container mx-auto px-4 py-8">
//         {/* Page Header */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
//             <ShoppingCart className="h-6 w-6 text-primary" />
//           </div>
//           <h1 className="text-3xl lg:text-4xl font-bold mb-2">Your Cart</h1>
//           <p className="text-muted-foreground text-sm max-w-xl mx-auto">
//             Review your selected books and proceed to checkout.
//           </p>
//         </div>

//         {/* Cart Items */}
//         {loading ? (
//           <p className="text-center text-muted-foreground">Loading...</p>
//         ) : cartItems.length === 0 ? (
//           <div className="text-center py-16">
//             <p className="text-muted-foreground mb-6">Your cart is empty.</p>
//             <Link to="/browse">
//               <Button>Start Shopping</Button>
//             </Link>
//           </div>
//         ) : (
//           <>
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//               {cartItems.map((item) => (
//                 <Card key={item._id}>
//                   <CardContent className="p-4 flex flex-col gap-4">
//                     <img
//                       src={item.image || "/placeholder.svg"}
//                       alt={item.title}
//                       className="h-48 w-full object-cover rounded-md"
//                     />
//                     <div className="space-y-1">
//                       <h3 className="text-lg font-semibold">{item.title}</h3>
//                       <p className="text-sm text-muted-foreground">
//                         by {item.author}
//                       </p>
//                       <p className="font-semibold text-primary">
//                         ₹{item.price} x {item.quantity}
//                       </p>
//                       <p className="text-sm">
//                         Subtotal: ₹{item.price * item.quantity}
//                       </p>
//                     </div>
//                     <Button
//                       variant="destructive"
//                       className="w-full"
//                       // Optional: Hook up with remove-from-cart functionality
//                       onClick={() => console.log("Remove", item._id)}
//                     >
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       Remove
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             {/* Summary & Checkout */}
//             <div className="max-w-xl mx-auto text-center">
//               <p className="text-xl font-semibold mb-4">
//                 Total: ₹{totalAmount.toFixed(2)}
//               </p>
//               <Button size="lg" className="w-full">
//                 Proceed to Checkout
//               </Button>
//             </div>
//           </>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Cart;
