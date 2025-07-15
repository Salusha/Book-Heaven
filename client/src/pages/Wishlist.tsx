import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.get("/api/wishlist/getwishlistdata", {
          headers: {
            "auth-token": token,
          },
        });
        setTimeout(() => {
          setWishlistItems(response.data.wishlistItems || []);
          setLoading(false);
        }, 400); // delay added for smooth transition
      } catch (err: any) {
        setError("Failed to load wishlist.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-16 text-center">
        {loading ? (
          <p className="text-muted-foreground">Loading your wishlist...</p>
        ) : (
          <div className="animate-fade-in">
            {wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-6">
                <Heart className="w-12 h-12 text-muted-foreground" />
                <h2 className="text-2xl font-bold">Your Wishlist is Empty</h2>
                <p className="text-muted-foreground max-w-md">
                  You haven't added any books to your wishlist yet. Start exploring
                  and save the ones you love!
                </p>
                <Link to="/browse">
                  <Button>Browse Books</Button>
                </Link>
              </div>
            ) : (
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-6">Your Wishlist</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {wishlistItems.map((item) => (
                    <BookCard key={item.product._id} book={item.product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;


// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// import { Button } from "@/components/ui/button";
// import { Heart } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import BookCard from "@/components/BookCard"; // assuming you're reusing this
// import { Book } from "@/lib/types"; // adjust if you use a different type

// const Wishlist = () => {
//   const [wishlistItems, setWishlistItems] = useState<Book[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const response = await axios.get("/api/wishlist"); // Replace with your actual endpoint
//         setWishlistItems(response.data); // assuming data is an array of books
//       } catch (err: any) {
//         setError("Failed to load wishlist.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWishlist();
//   }, []);

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="container mx-auto px-4 py-16 text-center">
        
//         {loading ? (
//           <p className="text-muted-foreground">Loading your wishlist...</p>
//         ) : error ? (
//           <div className="text-destructive">{error}</div>
//         ) : wishlistItems.length === 0 ? (
//           <div className="flex flex-col items-center justify-center space-y-6">
//             <Heart className="w-12 h-12 text-muted-foreground" />
//             <h2 className="text-2xl font-bold">Your Wishlist is Empty</h2>
//             <p className="text-muted-foreground max-w-md">
//               You haven't added any books to your wishlist yet. Start exploring
//               and save the ones you love!
//             </p>
//             <Link to="/browse">
//               <Button>Browse Books</Button>
//             </Link>
//           </div>
//         ) : (
//           <div className="text-left">
//             <h2 className="text-2xl font-bold mb-6">Your Wishlist</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {wishlistItems.map((book) => (
//                 <BookCard key={book.id} book={book} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Wishlist;  