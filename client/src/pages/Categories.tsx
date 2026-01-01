import { useEffect, useMemo, useState } from "react";
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
import { categories } from "@/lib/books-data";
import axios from "axios";
import { Book } from "@/lib/types";

const Categories = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const normalizeCategory = (value: string) => value.toLowerCase().replace(/[\s&-]+/g, "");

  const formatCategoryNameFromSlug = (slug?: string) => {
    if (!slug) return "";
    const withAmpersand = slug.replace("-&-", " & ");
    const spaced = withAmpersand.replace(/-/g, " ");
    const words = spaced
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (/^non fiction$/i.test(words)) return "Non-Fiction";
    if (/^self help$/i.test(words)) return "Self-Help";
    if (/^science fiction$/i.test(words)) return "Science Fiction";

    return words;
  };

  const slugifyCategory = (name: string) =>
    name.toLowerCase().replace(/&/g, "-&-").replace(/\s+/g, "-");

  const categoryName = formatCategoryNameFromSlug(categorySlug);

  const category = categories.find((c) => c.name?.toLowerCase() === categoryName?.toLowerCase());

  const [allProducts, setAllProducts] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        const mapped = (res.data.products || []).map(mapProductToBook);
        console.log("All products fetched:", mapped);
        const uniqueCats = [...new Set(mapped.map(p => p.category))];
        console.log("Unique categories in backend:", uniqueCats);
        
        // Log specific categories we're interested in
        uniqueCats.forEach(cat => {
          const count = mapped.filter(p => p.category === cat).length;
          console.log(`  "${cat}": ${count} books`);
        });
        
        setAllProducts(mapped);
        setLoading(false);
      } catch (err: any) {
        console.error("Failed to fetch products:", err);
        setError(err?.response?.data?.message || "Failed to load products.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle special cases
  const categoryBooks = useMemo(() => {
    if (!categoryName) return [];
    const filtered = allProducts.filter(
      (p) => normalizeCategory(p.category || "") === normalizeCategory(categoryName),
    );
    console.log("=== Category Search Debug ===");
    console.log("Slug:", categorySlug);
    console.log("Converted category name:", categoryName);
    console.log("Available categories:", [...new Set(allProducts.map(p => p.category))]);
    console.log("Products matching:", filtered.length);
    filtered.forEach(p => console.log(`  - ${p.title} (category: "${p.category}")`));
    return filtered;
  }, [allProducts, categoryName, categorySlug]);

  let displayBooks = categoryBooks;
  let displayTitle = categoryName;
  let displayDescription = category?.description || "";

  if (categorySlug === "bestsellers") {
    displayBooks = allProducts.filter((book) => book.bestseller);
    displayTitle = "Bestsellers";
    displayDescription = "The most popular books loved by readers worldwide";
  } else if (categorySlug === "new-releases") {
    displayBooks = allProducts.filter((book) => book.newRelease);
    displayTitle = "New Releases";
    displayDescription = "Fresh arrivals and latest publications";
  } else if (categorySlug === "featured") {
    displayBooks = allProducts.filter((book) => book.featured);
    displayTitle = "Featured Books";
    displayDescription = "Hand-picked selections from our editorial team";
  }

  if (
    !categoryBooks.length &&
    !["bestsellers", "new-releases", "featured"].includes(categorySlug || "") &&
    categorySlug && // Only show error if a slug was provided
    !loading // and products have finished loading
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
          Loading products...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="text-center text-destructive mb-6">{error}</div>
        )}
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
          {!loading && (!categorySlug || displayBooks.length === 0) && (
            <Badge variant="secondary" className="text-sm">
              {displayBooks.length} books available
            </Badge>
          )}
        </div>

        {/* Category Stats */}
        {category && !loading && displayBooks.length === 0 && (
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
                <Link key={cat.id} to={`/categories/${slugifyCategory(cat.name)}`}>
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

            {!loading && displayBooks.length === 0 ? (
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
                  <BookCard key={book._id} book={book} />
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
                <Link key="bestsellers" to="/categories/bestsellers">
                  <Button variant="outline" className="w-full h-16">
                    <div className="text-center">
                      <div className="font-semibold">Bestsellers</div>
                      <div className="text-xs text-muted-foreground">
                        {allProducts.filter((b) => b.bestseller).length} books
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link key="new-releases" to="/categories/new-releases">
                  <Button variant="outline" className="w-full h-16">
                    <div className="text-center">
                      <div className="font-semibold">New Releases</div>
                      <div className="text-xs text-muted-foreground">
                        {allProducts.filter((b) => b.newRelease).length} books
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link key="fiction" to="/categories/fiction">
                  <Button variant="outline" className="w-full h-16">
                    <div className="text-center">
                      <div className="font-semibold">Fiction</div>
                      <div className="text-xs text-muted-foreground">
                        {allProducts.filter((b) => b.category?.toLowerCase() === "fiction").length} books
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link key="non-fiction" to="/categories/non-fiction">
                  <Button variant="outline" className="w-full h-16">
                    <div className="text-center">
                      <div className="font-semibold">Non-Fiction</div>
                      <div className="text-xs text-muted-foreground">
                        {allProducts.filter((b) => b.category?.toLowerCase() === "non-fiction").length} books
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
