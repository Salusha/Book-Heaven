import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BookOpen,
  Search,
  ShoppingCart,
  User,
  Menu,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/books-data";
import axios from "axios";
import ProfileSheet from "./ProfileSheet";

const Navbar = () => {
  const navigate = useNavigate();
  const [cartItems] = useState<number>(3); // Mock cart items
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileSheetOpen, setProfileSheetOpen] = useState<boolean>(false);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [countsAvailable, setCountsAvailable] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
        setSearchInput("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch all products once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
        const res = await axios.get(`${apiBaseUrl}/api/products`);
        const products = res.data?.products || [];
        setAllProducts(products);
      } catch (err) {
        console.error("Failed to fetch products for navbar search", err);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query);
    
    if (query.trim()) {
      const filtered = allProducts.filter((product) =>
        product.name?.toLowerCase().includes(query.toLowerCase()) ||
        product.author?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5); // Show max 5 results
      setSearchResults(filtered);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchDropdown(false);
  };

  const slugifyCategory = (name: string) =>
    name
      .toLowerCase()
      .replace(/&/g, "-&-") // keep ampersand slug style consistent
      .replace(/\s+/g, "-");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
        const res = await axios.get(`${apiBaseUrl}/api/products`);
        const counts: Record<string, number> = {};
        (res.data.products || []).forEach((p: any) => {
          const cat = p?.category || "";
          const slug = slugifyCategory(cat);
          counts[slug] = (counts[slug] || 0) + 1;
        });
        setCategoryCounts(counts);
        setCountsAvailable(Object.keys(counts).length > 0);
      } catch (err) {
        console.error("Failed to fetch category counts", err);
        setCountsAvailable(false);
      }
    };
    fetchCounts();
  }, []);

  const handleProfileClick = () => {
    setProfileSheetOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Book Heaven</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="group inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Link to="/browse">Browse Books</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {categories.map((category) => {
                      const slug = slugifyCategory(category.name);
                      const count = categoryCounts[slug];
                      const showCount = countsAvailable && typeof count === "number";
                      return (
                      <Link
                        key={category.id}
                        to={`/categories/${slug}`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {category.name}
                        </div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          {category.description}
                        </p>
                        {showCount && (
                          <Badge variant="secondary" className="text-xs">
                            {count} {count === 1 ? "book" : "books"}
                          </Badge>
                        )}
                      </Link>
                      );
                    })}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="group inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Link to="/about">About</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="group inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Link to="/contact">Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm mx-4 hidden lg:block relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search books..."
                className="pl-10"
                value={searchInput}
                onChange={handleSearchChange}
                onFocus={() => searchInput && setShowSearchDropdown(true)}
              />
            </form>
            
            {/* Search Dropdown Results */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-50 mt-1 max-h-64 overflow-y-auto">
                {searchResults.map((product) => (
                  <Link
                    key={product._id}
                    to={`/book/${product._id}`}
                    className="block px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                    onClick={() => {
                      setSearchInput("");
                      setShowSearchDropdown(false);
                    }}
                  >
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-gray-600">{product.author || "Unknown author"}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Actions */}
          {/* Right Actions */}
<div className="flex items-center space-x-2">
  <Button variant="ghost" size="icon" className="lg:hidden">
    <Search className="h-5 w-5" />
  </Button>

  {/* Wishlist */}
  <Link to="/wishlist">
    <Button variant="ghost" size="icon" className="hidden sm:flex">
      <Heart className="h-5 w-5" />
    </Button>
  </Link>

  {/* Cart */}
  <Link to="/cart">
    <Button variant="ghost" size="icon" className="relative">
      <ShoppingCart className="h-5 w-5" />
    </Button>
  </Link>

  {/* Profile/Login */}
  <Button variant="ghost" size="icon" onClick={handleProfileClick}>
    <User className="h-5 w-5" />
  </Button>


            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  <Link
                    to="/browse"
                    className="text-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Browse Books
                  </Link>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Categories</h3>
                    {categories.map((category) => {
                      const slug = slugifyCategory(category.name);
                      return (
                        <Link
                          key={category.id}
                          to={`/categories/${slug}`}
                          className="block pl-4 py-1 text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Authors link removed */}

                  <Link
                    to="/about"
                    className="text-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>

                  <Link
                    to="/contact"
                    className="text-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>

                  <button
                    className="text-left text-lg font-medium"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleProfileClick();
                    }}
                  >
                    Profile
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {/* Profile Sheet */}
      <ProfileSheet open={profileSheetOpen} onOpenChange={setProfileSheetOpen} />
    </header>
  );
};

export default Navbar;
