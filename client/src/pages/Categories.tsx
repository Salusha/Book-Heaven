import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { categories, getBooksByCategory, books } from "@/lib/books-data";

const Categories = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  // Convert slug back to category name
  // const categoryName = categorySlug
  //   ? categorySlug
  //       .split("-")
  //       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //       .join(" ")
  //   : "";
  const categoryName = categorySlug
  ? categories.find(c => c.name.toLowerCase().replace(/\s+/g, "-") === categorySlug)?.name || ""
  : "";


  const category = categories.find((c) => c.name === categoryName);
  const categoryBooks = categoryName ? getBooksByCategory(categoryName) : [];

  // Handle special cases
  let displayBooks = categoryBooks;
  let displayTitle = categoryName;
  let displayDescription = category?.description || "";

  if (categorySlug === "bestsellers") {
    displayBooks = books.filter((book) => book.bestseller);
    displayTitle = "Bestsellers";
    displayDescription = "The most popular books loved by readers worldwide";
  } else if (categorySlug === "new-releases") {
    displayBooks = books.filter((book) => book.newRelease);
    displayTitle = "New Releases";
    displayDescription = "Fresh arrivals and latest publications";
  } else if (categorySlug === "featured") {
    displayBooks = books.filter((book) => book.featured);
    displayTitle = "Featured Books";
    displayDescription = "Hand-picked selections from our editorial team";
  }

  if (
    !category &&
    !["bestsellers", "new-releases", "featured"].includes(categorySlug || "")
  ) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The category you're looking for doesn't exist.
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/browse" className="hover:text-foreground">
            Browse
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{displayTitle}</span>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">{displayTitle}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            {displayDescription}
          </p>
          <Badge variant="secondary" className="text-sm">
            {displayBooks.length} books available
          </Badge>
        </div>

        {/* Category Stats */}
        {category && (
          <Card className="mb-12">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {displayBooks.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Books
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {displayBooks.filter((book) => book.inStock).length}
                  </div>
                  <div className="text-sm text-muted-foreground">In Stock</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.round(
                      (displayBooks.reduce(
                        (acc, book) => acc + book.rating,
                        0,
                      ) /
                        displayBooks.length) *
                        10,
                    ) / 10 || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg. Rating
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Categories Grid */}
        {!categorySlug && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">All Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="group-hover:text-primary transition-colors">
                          {cat.name}
                        </span>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {cat.description}
                      </p>
                      <Badge variant="secondary">{cat.bookCount} books</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Books in Category */}
        {categorySlug && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Books in {displayTitle}</h2>
              {displayBooks.length > 12 && (
                <Link to="/browse" state={{ category: categoryName }}>
                  <Button variant="ghost">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>

            {displayBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Books Found</h3>
                <p className="text-muted-foreground mb-6">
                  We don't have any books in this category yet, but check back
                  soon!
                </p>
                <Link to="/browse">
                  <Button>Browse All Books</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Featured Categories (if on main categories page) */}
        {!categorySlug && (
          <>
            <Separator className="my-12" />
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Popular Categories</h2>
              <p className="text-muted-foreground mb-8">
                Explore our most popular book categories
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/categories/bestsellers">
                  <Button variant="outline" className="w-full h-16">
                    <div className="text-center">
                      <div className="font-semibold">Bestsellers</div>
                      <div className="text-xs text-muted-foreground">
                        {books.filter((b) => b.bestseller).length} books
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link to="/categories/new-releases">
                  <Button variant="outline" className="w-full h-16">
                    <div className="text-center">
                      <div className="font-semibold">New Releases</div>
                      <div className="text-xs text-muted-foreground">
                        {books.filter((b) => b.newRelease).length} books
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link to="/categories/fiction">
                  <Button variant="outline" className="w-full h-16">
                    <div className="text-center">
                      <div className="font-semibold">Fiction</div>
                      <div className="text-xs text-muted-foreground">
                        {getBooksByCategory("Fiction").length} books
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link to="/categories/non-fiction">
                  <Button variant="outline" className="w-full h-16">
                    <div className="text-center">
                      <div className="font-semibold">Non-Fiction</div>
                      <div className="text-xs text-muted-foreground">
                        {getBooksByCategory("Non-Fiction").length} books
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
