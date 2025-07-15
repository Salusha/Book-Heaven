import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User, BookOpen, Search, ArrowRight, ExternalLink } from "lucide-react";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { authors, getBooksByAuthor } from "@/lib/books-data";

const Authors = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAuthors = useMemo(() => {
    return authors.filter(
      (author) =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.bio.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Authors</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover talented writers and explore their literary works
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAuthors.map((author) => {
            const authorBooks = getBooksByAuthor(author.name);
            return (
              <Card
                key={author.id}
                className="group hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <img
                      src={author.image}
                      alt={author.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg"
                    />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {author.name}
                  </CardTitle>
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {author.bookCount} books
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {author.bio}
                  </p>

                  {author.website && (
                    <div className="flex items-center text-sm text-primary">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      <a
                        href={author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {authorBooks
                      .map((book) => (
                        <Badge
                          key={book.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {book.category}
                        </Badge>
                      ))
                      .slice(0, 3)}
                  </div>

                  <Link
                    to={`/authors/${author.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Button variant="outline" className="w-full">
                      View Books
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredAuthors.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Authors Found</h3>
            <p className="text-muted-foreground mb-6">
              No authors match your search criteria. Try a different search
              term.
            </p>
            <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
          </div>
        )}

        {/* Featured Authors Section */}
        <div className="border-t pt-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Authors
          </h2>

          {authors.slice(0, 2).map((author) => {
            const authorBooks = getBooksByAuthor(author.name);
            return (
              <div key={author.id} className="mb-12 last:mb-0">
                <Card>
                  <CardContent className="p-8">
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                      {/* Author Info */}
                      <div className="text-center lg:text-left">
                        <img
                          src={author.image}
                          alt={author.name}
                          className="w-32 h-32 rounded-full object-cover mx-auto lg:mx-0 mb-4 border-4 border-background shadow-lg"
                        />
                        <h3 className="text-2xl font-bold mb-2">
                          {author.name}
                        </h3>
                        <div className="flex items-center justify-center lg:justify-start space-x-2 text-muted-foreground mb-4">
                          <BookOpen className="h-4 w-4" />
                          <span>{author.bookCount} books published</span>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {author.bio}
                        </p>
                        {author.website && (
                          <a
                            href={author.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:underline"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Visit Website
                          </a>
                        )}
                      </div>

                      {/* Author's Books */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold">
                            Books by {author.name}
                          </h4>
                          <Link
                            to={`/authors/${author.name.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <Button variant="ghost" size="sm">
                              View All
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {authorBooks.slice(0, 2).map((book) => (
                            <BookCard key={book.id} book={book} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-muted/50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-6">Our Author Community</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {authors.length}+
              </div>
              <div className="text-muted-foreground">Talented Authors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {authors.reduce((total, author) => total + author.bookCount, 0)}
                +
              </div>
              <div className="text-muted-foreground">Published Books</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {
                  new Set(
                    authors
                      .map((author) =>
                        getBooksByAuthor(author.name).map(
                          (book) => book.category,
                        ),
                      )
                      .flat(),
                  ).size
                }
                +
              </div>
              <div className="text-muted-foreground">Genres Covered</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Authors;
