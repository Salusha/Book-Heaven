import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Heart,
  ShoppingCart,
  BookOpen,
  Calendar,
  User,
  Building,
  Globe,
  Package,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [updatingWishlist, setUpdatingWishlist] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const { isInWishlist, addToWishlist, removeFromWishlist, refreshWishlist } = useWishlist();
  const { addToCart: addIdToCart, isInCart, refreshCart, getQuantity, removeFromCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${apiBaseUrl}/api/product/${id}`);
        setProduct(response.data?.response?.data?.product);
      } catch (err) {
        console.error("Failed to load product", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, apiBaseUrl]);

  useEffect(() => {
    if (!product) return;
    const stock = Math.max(0, Number(product.Stock) || 0);
    const cartQuantity = getQuantity(product._id);
    setQuantity(cartQuantity > 0 ? cartQuantity : (stock > 0 ? 1 : 0));
  }, [product, getQuantity]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/browse">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const book = {
    _id: product._id,
    title: product.name,
    author: product.author,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice ?? null,
    rating: product.ratings || 0,
    reviewCount: product.numOfReviews || 0,
    category: product.category,
    publisher: product.publisher || "Book Haven",
    publishedDate: product.publishedDate || product.createdAt,
    pages: product.pages || 0,
    language: product.language || "English",
    coverImage: product.images?.[0]?.url || "/placeholder.svg",
    inStock: product.Stock > 0,
    stock: Math.max(0, Number(product.Stock) || 0),
    bestseller: Boolean(product.bestseller),
    newRelease: Boolean(product.newRelease),
    featured: Boolean(product.featured),
    isbn: product.isbn || product._id || "N/A",
  };

  const discountPercentage = 0;
  const lowStock = book.stock < 5;

  const inWishlist = isInWishlist(book._id);
  const inCart = isInCart ? isInCart(book._id) : false;

  const ensureAuth = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      toast({ title: "Login required", variant: "destructive" });
      navigate("/login");
      return null;
    }
    return token;
  };

  const handleToggleWishlist = async () => {
    const token = ensureAuth();
    if (!token) return;
    try {
      setUpdatingWishlist(true);
      if (inWishlist) {
        await axios.delete(`${apiBaseUrl}/api/wishlist/removefromwishlist/${book._id}`, {
          headers: { "auth-token": token },
        });
        removeFromWishlist(book._id);
        toast({ title: "Removed from wishlist" });
      } else {
        await axios.post(`${apiBaseUrl}/api/wishlist/addtowishlist/${book._id}`, null, {
          headers: { "auth-token": token },
        });
        addToWishlist(book._id);
        toast({ title: "Added to wishlist" });
      }
      refreshWishlist();
    } catch (err: any) {
      toast({ title: "Wishlist error", variant: "destructive" });
    } finally {
      setUpdatingWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    const token = ensureAuth();
    if (!token) return;
    try {
      setAddingToCart(true);
      if (inCart) {
        await axios.post(`${apiBaseUrl}/api/cart/remove-product`, { productId: book._id }, { headers: { "auth-token": token } });
        removeFromCart(book._id);
        setQuantity(1);
        toast({ title: "Removed from cart" });
      } else {
        const items = [{ product: book._id, price: book.price }];
        await axios.post(`${apiBaseUrl}/api/cart`, { cartItems: items }, { headers: { "auth-token": token } });
        await refreshCart();
        toast({ title: "Added to cart" });
      }
    } catch (err: any) {
      toast({ title: "Cart error", variant: "destructive" });
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/browse" className="hover:text-foreground">Browse</Link>
          <span className="mx-2">/</span>
          <Link to={`/categories/${book.category.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-foreground">{book.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{book.title}</span>
        </div>

        <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="relative">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full max-w-sm mx-auto h-[20rem] object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {book.bestseller && <Badge variant="destructive">Bestseller</Badge>}
                {book.newRelease && <Badge variant="secondary">New Release</Badge>}
                {discountPercentage > 0 && <Badge variant="default">-{discountPercentage}%</Badge>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-2">{book.category}</Badge>
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <Link to={`/authors/${book.author.toLowerCase().replace(/\s+/g, "-")}`} className="text-lg text-muted-foreground hover:text-primary transition-colors">by {book.author}</Link>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex relative">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="relative">
                    <Star className="h-5 w-5 text-gray-300" />
                    <div
                      className="absolute top-0 left-0 overflow-hidden"
                      style={{
                        width: `${Math.max(0, Math.min(1, book.rating - star + 1)) * 100}%`,
                      }}
                    >
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                ))}
              </div>
              <span className="text-lg font-medium">{book.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({book.reviewCount} reviews)</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary">₹{book.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                {book.originalPrice && <span className="text-xl text-muted-foreground line-through">₹{book.originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>}
              </div>
              {discountPercentage > 0 && (
                <p className="text-sm text-green-600">
                  You save ₹{(book.originalPrice - book.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })} ({discountPercentage}% off)
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className={cn("h-3 w-3 rounded-full", book.inStock ? "bg-green-500" : "bg-red-500")} />
              <span className={cn("font-medium", book.inStock ? "text-green-600" : "text-red-600")}>{book.inStock ? "In Stock" : "Out of Stock"}</span>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button className="flex-1" variant={inCart ? "destructive" : "default"} disabled={!book.inStock || addingToCart} size="lg" onClick={handleAddToCart}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {addingToCart ? (inCart ? "Removing..." : "Adding...") : (book.inStock ? (inCart ? "Remove from Cart" : "Add to Cart") : "Out of Stock")}
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleToggleWishlist} disabled={updatingWishlist}>
                      <Heart className={cn("h-4 w-4", inWishlist ? "fill-red-500 text-red-500" : "")} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={!book.inStock}
                    >
                      {book.inStock ? "Buy Now" : "Out of Stock"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="recommendations">More Like This</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">ISBN:</span>
                      <span>{book.isbn}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Publisher:</span>
                      <span>{book.publisher}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Published:</span>
                      <span>{new Date(book.publishedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Pages:</span>
                      <span>{book.pages}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Language:</span>
                      <span>{book.language}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Category:</span>
                      <Link to={`/categories/${book.category.toLowerCase().replace(/\s+/g, "-")}`} className="text-primary hover:underline">{book.category}</Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6"></TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">You Might Also Like</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <p className="text-muted-foreground">Related products coming soon</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default BookDetails;
