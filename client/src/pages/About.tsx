import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  BookOpen,
  Heart,
  Users,
  Award,
  Globe,
  Truck,
  Shield,
  Star,
  ArrowRight,
  Compass,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const About = () => {
  const stats = [
    { icon: BookOpen, label: "Books Available", value: "10,000+" },
    { icon: Users, label: "Happy Customers", value: "50,000+" },
    { icon: Globe, label: "Countries Served", value: "25+" },
    { icon: Award, label: "Years of Service", value: "15+" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Books",
      description:
        "We believe in the transformative power of reading and are passionate about connecting readers with their perfect books.",
    },
    {
      icon: Users,
      title: "Community Focus",
      description:
        "Building a community of book lovers who share recommendations, reviews, and their love for literature.",
    },
    {
      icon: Shield,
      title: "Trust & Quality",
      description:
        "We ensure every book in our collection meets our high standards for quality and authenticity.",
    },
    {
      icon: Search,
      title: "Continuous Discovery",
      description:
        "We're always exploring new genres, authors, and voices to keep our collection fresh and exciting for every kind of reader.",
    },
  ];

  const team = [
    {
      name: "Sarah Mitchell",
      role: "Founder & CEO",
      description:
        "A lifelong book lover with 20+ years in publishing, Sarah founded Book Heaven to create the ultimate reading destination.",
      image: "/placeholder.svg",
    },
    {
      name: "David Chen",
      role: "Head of Curation",
      description:
        "David's expertise in literature helps us select the finest books and discover emerging talent in the literary world.",
      image: "/placeholder.svg",
    },
    {
      name: "Emily Rodriguez",
      role: "Community Manager",
      description:
        "Emily builds bridges between authors and readers, fostering our vibrant community of book enthusiasts.",
      image: "/placeholder.svg",
    },
  ];

  const milestones = [
    { year: "2009", event: "Book Heaven founded with 1,000 books" },
    { year: "2012", event: "Reached 10,000 customers milestone" },
    { year: "2015", event: "Launched international shipping" },
    { year: "2018", event: "Introduced digital book platform" },
    { year: "2021", event: "Opened author partnership program" },
    { year: "2024", event: "Celebrating 50,000+ happy readers" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            About Book Heaven
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're more than just a bookstore. We're a community of passionate
            readers, dedicated to helping you discover your next great read and
            connecting you with stories that inspire, educate, and entertain.
          </p>
          <Link to="/browse">
            <Button size="lg">
              Explore Our Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats Section */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <IconComponent className="h-8 w-8 text-primary mx-auto mb-4" />
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div> */}
        <Separator className="my-8" />

        {/* Our Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Book Heaven began with a simple mission: to create a
                place where book lovers could find exactly what they're looking
                for and discover something they never knew they needed.
              </p>
              <p>
                What started as a small online bookstore has grown into a
                thriving community of readers, authors, and literary enthusiasts
                from around the world. We've carefully curated our collection to
                include everything from bestselling novels to hidden gems
                waiting to be discovered.
              </p>
              <p>
                Today, we're proud to serve our customers across the
                country, but our commitment remains the same: to provide
                exceptional service, quality books, and a platform where the
                love of reading can flourish.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="/placeholder.svg"
              alt="Book Heaven team"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and shape the experience
              we create for our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        {/* <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Book Heaven who work tirelessly to
              bring you the best reading experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-background shadow-lg"
                  />
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-4">
                    {member.role}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}

        {/* Timeline */}
        {/* <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Key milestones in our journey to becoming the premier destination
              for book lovers.
            </p>
          </div>

          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">
                    {milestone.year}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
        <Separator className="my-8" />

        {/* Why Choose Us */}
        <div className="bg-muted/50 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Book Heaven?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing an exceptional experience for every
              book lover.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-3">
                Hassle-Free Shopping
              </h3>
              <p className="text-sm text-muted-foreground">
                Easy navigation, secure checkout, and excellent customer support make every visit 
                smooth and enjoyable.
              </p>
            </div>

            <div className="text-center">
              <Star className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-3">Curated Selection</h3>
              <p className="text-sm text-muted-foreground">
                Every book is carefully selected by our team of literary experts
                and book lovers.
              </p>
            </div>

            <div className="text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-3">Community Driven</h3>
              <p className="text-sm text-muted-foreground">
                Join a community of readers who share recommendations and
                celebrate great literature.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
