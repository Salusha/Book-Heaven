import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

interface CartItem {
  _id: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  image?: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

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
      const res = await axios.get("/customer/cart", {
        headers: {
          "auth-token": token,
        },
      });

      console.log("Cart API Response:", res.data);

      const transformed = (res.data.cartItems || [])
        .map((item: any) => {
          if (!item.product) return null;
          return {
            _id: item.product._id,
            title: item.product.name,
            author: item.product.author,
            price: item.price,
            image: item.product.images?.[0]?.url || "/placeholder.svg",
            quantity: 1,
          };
        })
        .filter(Boolean); // remove nulls

      setCartItems(transformed);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCartItems([]);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  fetchCart();
}, []);



  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Your Cart</h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Review your selected books and proceed to checkout.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading your cart...</div>
        ) : (
          <div className="animate-fade-in">
            {cartItems.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted-foreground mb-6">Your cart is empty.</p>
                <Link to="/browse">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {cartItems.map((item) => (
                    <Card key={item._id} className="opacity-0 animate-fade-in-fast">
                      <CardContent className="p-4 flex flex-col gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="h-48 w-full object-cover rounded-md"
                        />
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">by {item.author}</p>
                          <p className="font-semibold text-primary">
                            ₹{item.price} x {item.quantity}
                          </p>
                          <p className="text-sm">
                            Subtotal: ₹{item.price * item.quantity}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => console.log("Remove", item._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="max-w-xl mx-auto text-center">
                  <p className="text-xl font-semibold mb-4">
                    Total: ₹{totalAmount.toFixed(2)}
                  </p>
                  <Button size="lg" className="w-full">
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
