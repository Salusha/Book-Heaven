import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { Book } from "@/lib/types";
import { useWishlist } from "@/contexts/WishlistContext";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { refreshWishlist, wishlistIds } = useWishlist();

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
    publisher: product.publisher || "Book Haven",
    publishedDate: product.publishedDate || product.createdAt || new Date().toISOString(),
    pages: product.pages || 0,
    language: product.language || "English",
    coverImage: product.images?.[0]?.url || "/placeholder.svg",
    inStock: product.Stock ? product.Stock > 0 : true,
    featured: Boolean(product.featured),
    bestseller: Boolean(product.bestseller),
    newRelease: Boolean(product.newRelease),
  });

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        console.log("Fetching wishlist, token present:", !!token);
        
        const response = await axios.get("/api/wishlist/getwishlistdata", {
          headers: {
            "auth-token": token,
          },
        });
        
        console.log("Wishlist response:", response.data);
        setWishlistItems(response.data.wishlistItems || []);
        setLoading(false);
        await refreshWishlist(); // Sync global wishlist state
      } catch (err: any) {
        console.error("Wishlist error:", err);
        setError(err.response?.data?.message || "Failed to load wishlist.");
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const wishlistBooks = wishlistItems
    .map((item) => item?.product)
    .filter(Boolean)
    .filter((product) => wishlistIds.has(product._id)) // Only show items still in wishlist
    .map(mapProductToBook);

  console.log("Wishlist books to render:", wishlistBooks);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-16 text-center">
        {loading ? (
          <p className="text-muted-foreground">Loading your wishlist...</p>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : (
          <div className="animate-fade-in">
            {wishlistBooks.length === 0 ? (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {wishlistBooks.map((book) => (
                    <BookCard key={book._id} book={book} className="max-w-sm" />
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