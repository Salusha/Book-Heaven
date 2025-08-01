import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Star,
  Users,
  Truck,
  RefreshCw,
  Shield,
  ArrowRight,
  Quote,
  Heart,
  Search,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import {
  featuredBooks,
  bestsellers,
  newReleases,
  categories,
} from "@/lib/books-data";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  📚Books Available
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Welcome to <span className="text-primary">Book Heaven</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Discover your next great read from our curated collection of
                  bestsellers, new releases, and timeless classics. Where every
                  book lover finds their paradise.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/browse">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse Books
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/categories/bestsellers">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    View Bestsellers
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">📚</div>
                  <div className="text-sm text-muted-foreground">Stories for Every Soul</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">💡</div>
                  <div className="text-sm text-muted-foreground">Curated Picks Every Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9★</div>
                  <div className="text-sm text-muted-foreground">
                    Average Rating
                  </div>
                </div>
              </div>
            </div>

           <div className="relative">
  <div className="grid grid-cols-2 gap-4">
    <div className="relative mt-8">
      <Link to="/book/1">
        <img
          src="https://images.unsplash.com/photo-1558901357-ca41e027e43a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9va3xlbnwwfDJ8MHx8fDA%3D"
          alt="Book 1"
          className="w-full h-48 object-cover rounded-lg shadow-lg"
        />
      </Link>
    </div>
    <div className="relative">
      <Link to="/book/2">
        <img
          src="https://images.unsplash.com/photo-1651841689044-00521ab0fa66?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJvb2tzfGVufDB8MnwwfHx8MA%3D%3D"
          alt="Book 2"
          className="w-full h-48 object-cover rounded-lg shadow-lg"
        />
      </Link>
    </div>
    <div className="relative mt-8">
      <Link to="/book/3">
        <img
          src="https://media.istockphoto.com/id/1022236966/photo/conceptual-background-on-history-education-literature-topics.webp?a=1&b=1&s=612x612&w=0&k=20&c=4CmFmCuY7vbIWBX9U53fk4Dphr4PmsAikOfN5QKoOEA="
          alt="Book 3"
          className="w-full h-48 object-cover rounded-lg shadow-lg"
        />
      </Link>
    </div>
  </div>
  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-lg"></div>
</div>

          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Books</h2>
              <p className="text-muted-foreground mt-2">
                Hand-picked selections from our editorial team
              </p>
            </div>
            <Link to="/browse?featured=true">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From fiction to science, romance to mystery - find exactly what
              you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.bookCount} books available
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Bestsellers</h2>
              <p className="text-muted-foreground mt-2">
                The most popular books loved by readers
              </p>
            </div>
            <Link to="/categories/bestsellers">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bestsellers.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* New Releases */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">New Releases</h2>
              <p className="text-muted-foreground mt-2">
                Fresh arrivals and latest publications
              </p>
            </div>
            <Link to="/categories/new-releases">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newReleases.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Book Heaven?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the best book shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Passion for Books</h3>
                <p className="text-sm text-muted-foreground">
                  We believe in the transformative power of reading and are passionate about connecting readers with their perfect books.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Community Focus</h3>
                <p className="text-sm text-muted-foreground">
                  Building a community of book lovers who share recommendations, reviews, and their love for literature.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Trust & Quality</h3>
                <p className="text-sm text-muted-foreground">
                  We ensure every book in our collection meets our high standards for quality and authenticity.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Continuous Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  We're always exploring new genres, authors, and voices to keep our collection fresh and exciting for every kind of reader.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Readers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who've found their perfect
              books
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  "Book Heaven has the best selection and fastest delivery. I've
                  found so many amazing books here that I couldn't find anywhere
                  else."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold">RS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Riya Sharma</div>
                    <div className="text-xs text-muted-foreground">
                      Verified Customer
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  "The customer service is exceptional. They helped me find
                  exactly what I was looking for and even recommended similar
                  books."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold">AM</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Aarav Mehta</div>
                    <div className="text-xs text-muted-foreground">
                      Verified Customer
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  "I love the book recommendations feature. It's introduced me
                  to so many new authors and genres I never would have
                  discovered."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold">SP</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Sneha Patel</div>
                    <div className="text-xs text-muted-foreground">
                      Verified Customer
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary/5 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get the latest book recommendations, exclusive offers, and
              literary news delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
              />
              <Button>Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
