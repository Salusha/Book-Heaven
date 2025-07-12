import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">
                Book Heaven
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your ultimate destination for books. Discover, explore, and fall
              in love with reading all over again.
            </p>
            <div className="flex space-x-2">
  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
    <Button variant="ghost" size="icon">
      <Facebook className="h-4 w-4" />
    </Button>
  </a>
  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
    <Button variant="ghost" size="icon">
      <Twitter className="h-4 w-4" />
    </Button>
  </a>
  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
    <Button variant="ghost" size="icon">
      <Instagram className="h-4 w-4" />
    </Button>
  </a>
  <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
    <Button variant="ghost" size="icon">
      <Youtube className="h-4 w-4" />
    </Button>
  </a>
</div>

          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/browse"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Books
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/authors"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Authors
                </Link>
              </li> */}
              <li>
                <Link
                  to="/categories/fiction"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Fiction
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/non-fiction"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Non-Fiction
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/bestsellers"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/new-releases"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li> */}
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Stay Connected</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for book recommendations and exclusive
              offers.
            </p>
            <div className="flex space-x-2">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button type="submit" size="sm">
                Subscribe
              </Button>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@bookheaven.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>X-XXX-BOOK-HEAVEN</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Book Street, Reading City</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 Book Heaven. All rights reserved.
          </div>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/cookies"
              className="hover:text-foreground transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
