import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Book } from "@/lib/types";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

interface BookCardProps {
  book: Book;
  className?: string;
  showFullDescription?: boolean;
  layout?: "grid" | "list";
  quantity?: number;
  maxQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

const BookCard = ({
  book,
  className,
  showFullDescription = false,
  layout = "grid",
  quantity = 1,
  maxQuantity = 999,
  onQuantityChange,
}: BookCardProps) => {
  const navigate = useNavigate();
  const isList = layout === "list";
  const discountPercentage = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  const [adding, setAdding] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || "";
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isInCart, addToCart: addIdToCart, removeFromCart: removeIdFromCart } = useCart();
  const inWishlist = isInWishlist(book._id);
  const inCart = isInCart(book._id);

  const handleToggleWishlist = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      toast({ title: "Login required", variant: "destructive" });
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      if (inWishlist) {
        // Remove from wishlist
        await axios.delete(`${apiBaseUrl}/api/wishlist/removefromwishlist/${book._id}`, {
          headers: { "auth-token": token },
        });
        removeFromWishlist(book._id);
        toast({ title: "Removed from wishlist" });
      } else {
        // Add to wishlist
        await axios.post(`${apiBaseUrl}/api/wishlist/addtowishlist/${book._id}`, null, {
          headers: { "auth-token": token },
        });
        addToWishlist(book._id);
        toast({ title: "Added to wishlist" });
      }
    } catch (err: any) {
      toast({ title: "Wishlist error", variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      toast({ title: "Login required", variant: "destructive" });
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      if (inCart) {
        await axios.post(`${apiBaseUrl}/api/cart/remove-product`, { productId: book._id }, {
          headers: { "auth-token": token },
        });
        removeIdFromCart(book._id);
        toast({ title: "Removed from cart" });
      } else {
        await axios.post(`${apiBaseUrl}/api/cart`, {
          cartItems: {
            product: book._id,
            price: book.price,
          },
        }, {
          headers: { "auth-token": token },
        });
        addIdToCart(book._id);
        toast({ title: "Added to cart" });
      }
    } catch (err: any) {
      toast({ title: "Cart error", variant: "destructive" });
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer",
        isList && "flex flex-col md:flex-row h-full",
        className,
      )}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/book/${book._id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/book/${book._id}`);
        }
      }}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          isList && "md:w-40 w-full md:flex-shrink-0",
        )}
      >
        <img
          src={book.coverImage}
          alt={book.title}
          className={cn(
            "object-cover transition-transform duration-200 group-hover:scale-105",
            isList ? "w-full md:w-40 h-44" : "w-full h-[20rem]",
          )}
          onError={(e) => {
            console.error("Failed to load image:", book.coverImage);
            e.currentTarget.src = "/placeholder.svg";
          }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {book.bestseller && (
            <Badge variant="destructive" className="text-xs">
              Bestseller
            </Badge>
          )}
          {book.newRelease && (
            <Badge variant="secondary" className="text-xs">
              New
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="default" className="text-xs">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button 
            variant={inWishlist ? "default" : "secondary"} 
            size="icon" 
            className={cn("h-8 w-8", inWishlist && "bg-red-500 hover:bg-red-600")}
            onClick={(e) => { e.stopPropagation(); handleToggleWishlist(); }} 
            disabled={adding}
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
          </Button>
          <Button 
            variant={inCart ? "destructive" : "secondary"}
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
            disabled={addingToCart || !book.inStock}
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={2.5} />
          </Button>
        </div>

        {/* Out of Stock Overlay */}
        {!book.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>

      <CardContent className={cn("px-4 pb-4 pt-1", isList && "flex-1 flex flex-col gap-2") }>
        <div className="space-y-0">
          {/* Category */}
          <Link
            to={`/categories/${book.category.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {book.category}
          </Link>

          {/* Title */}
          <Link to={`/book/${book._id}`}>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
          </Link>

          {/* Author */}
          <Link
            to={`/authors/${book.author.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            by {book.author}
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => {
                const fillPercentage = Math.max(0, Math.min(1, book.rating - star + 1));
                const isFilled = fillPercentage === 1;
                const isHalf = fillPercentage > 0 && fillPercentage < 1;
                const isEmpty = fillPercentage === 0;

                return (
                  <div key={star} className="relative h-4 w-4">
                    {/* Empty star background */}
                    <Star className="h-4 w-4 text-gray-300 absolute" />
                    {/* Filled star overlay */}
                    {(isFilled || isHalf) && (
                      <div
                        className="absolute overflow-hidden"
                        style={{ width: `${fillPercentage * 100}%` }}
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <span className="text-sm text-muted-foreground">{book.rating}</span>
          </div>

          {/* Description */}
          {showFullDescription ? (
            <p className="text-sm text-muted-foreground">{book.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {book.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-primary">
                ₹{book.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              {book.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{book.originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>
            {onQuantityChange && (
              <div className="flex items-center gap-1 border rounded">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (quantity > 1) onQuantityChange(quantity - 1);
                  }}
                  className="px-1.5 py-0.5 hover:bg-muted transition-colors"
                >
                  −
                </button>
                <span className="px-1.5 py-0.5 min-w-6 text-center text-sm">{quantity}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (quantity < maxQuantity) onQuantityChange(quantity + 1);
                  }}
                  className="px-1.5 py-0.5 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity >= maxQuantity}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
