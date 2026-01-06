import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import BookDetails from "./pages/BookDetails";
import Categories from "./pages/Categories";
import Authors from "./pages/Authors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
        <WishlistProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categorySlug" element={<Categories />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/authors/:authorSlug" element={<Authors />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          

        </Routes>
        </WishlistProvider>
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
