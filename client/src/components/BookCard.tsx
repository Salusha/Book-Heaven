import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
  className?: string;
  showFullDescription?: boolean;
}

const BookCard = ({
  book,
  className,
  showFullDescription = false,
}: BookCardProps) => {
  const discountPercentage = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-200 hover:shadow-lg",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-[23rem] object-cover transition-transform duration-200 group-hover:scale-105"
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
          <Button variant="secondary" size="icon" className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
          <Link to={`/book/${book._id}`}>
            <Button variant="secondary" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Out of Stock Overlay */}
        {!book.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
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
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-4 w-4",
                    star <= Math.floor(book.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300",
                  )}
                />
              ))}
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
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Button className="flex-1" disabled={!book.inStock} size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {book.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <Link to={`/book/${book._id}`} className="flex-shrink-0">
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
