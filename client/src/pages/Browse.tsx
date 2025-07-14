import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { books, categories } from "@/lib/books-data";
import { Book } from "@/lib/types";

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showBestsellers, setShowBestsellers] = useState(false);
  const [showNewReleases, setShowNewReleases] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredBooks = useMemo(() => {
    let filtered = books.filter((book) => {
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(book.category);

      const matchesStock = !showInStockOnly || book.inStock;
      const matchesBestseller = !showBestsellers || book.bestseller;
      const matchesNewRelease = !showNewReleases || book.newRelease;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock &&
        matchesBestseller &&
        matchesNewRelease
      );
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.publishedDate).getTime() -
            new Date(a.publishedDate).getTime()
        );
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [
    searchQuery,
    sortBy,
    selectedCategories,
    priceRange,
    showInStockOnly,
    showBestsellers,
    showNewReleases,
  ]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange([0, 50]);
    setShowInStockOnly(false);
    setShowBestsellers(false);
    setShowNewReleases(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.name, checked as boolean)
                }
              />
              <label
                htmlFor={category.id}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {category.name} ({category.bookCount})
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={50}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div> */}

      {/* <Separator /> */}

      <div>
        <h3 className="font-semibold mb-3">Additional Filters</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={showInStockOnly}
              onCheckedChange={(checked) =>
                setShowInStockOnly(checked as boolean)
              }
            />
            <label htmlFor="in-stock" className="text-sm font-medium cursor-pointer">
              In Stock Only
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="bestsellers"
              checked={showBestsellers}
              onCheckedChange={(checked) =>
                setShowBestsellers(checked as boolean)
              }
            />
            <label htmlFor="bestsellers" className="text-sm font-medium cursor-pointer">
              Bestsellers Only
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-releases"
              checked={showNewReleases}
              onCheckedChange={(checked) =>
                setShowNewReleases(checked as boolean)
              }
            />
            <label htmlFor="new-releases" className="text-sm font-medium cursor-pointer">
              New Releases Only
            </label>
          </div>
        </div>
      </div>

      <Separator />

      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Books</h1>
          <p className="text-muted-foreground">
            Discover your next great read from our extensive collection
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search books, authors, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search to find exactly what you're looking for
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            {(selectedCategories.length > 0 ||
              showInStockOnly ||
              showBestsellers ||
              showNewReleases) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleCategoryChange(category, false)}
                    >
                      {category} ×
                    </Badge>
                  ))}
                  {showInStockOnly && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setShowInStockOnly(false)}
                    >
                      In Stock ×
                    </Badge>
                  )}
                  {showBestsellers && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setShowBestsellers(false)}
                    >
                      Bestsellers ×
                    </Badge>
                  )}
                  {showNewReleases && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setShowNewReleases(false)}
                    >
                      New Releases ×
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {filteredBooks.length} of {books.length} books
              </p>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No books found matching your criteria.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book._id} // ✅ Updated here
                    book={book}
                    showFullDescription={viewMode === "list"}
                    className={viewMode === "list" ? "flex flex-row" : ""}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Browse;
