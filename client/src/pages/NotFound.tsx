import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🚧</span>
              <h1 className="text-4xl md:text-5xl font-semibold text-foreground">
                Page Under Development
              </h1>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3 border-l-4 border-primary pl-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              This page is currently under development and will be updated soon. 
              For now, this website is created for learning and demonstration purposes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link to="/" className="flex-1">
              <Button className="w-full" size="lg">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.history.back()}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Footer Note */}
          <div className="border-l-4 border-primary pl-6 pt-4">
            <p className="text-muted-foreground italic">
              Thanks for your understanding!
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
