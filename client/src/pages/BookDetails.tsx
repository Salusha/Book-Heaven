import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

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
    setQuantity(stock > 0 ? 1 : 0);
  }, [product]);

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
  };

  const discountPercentage = 0;

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
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">Quantity:</span>
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || !book.inStock}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                        disabled={!book.inStock || quantity >= book.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Available: {book.stock}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" disabled={!book.inStock || quantity < 1} size="lg">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {book.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => setIsFavorite(!isFavorite)}>
                      <Heart className={cn("h-4 w-4", isFavorite ? "fill-red-500 text-red-500" : "")} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">Add to Wishlist</Button>
                    <Button variant="outline" size="sm">Buy Now</Button>
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
