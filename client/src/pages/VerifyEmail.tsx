import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const verifyEmailToken = async () => {
      const emailToken = searchParams.get("token");
      
      if (!emailToken) {
        setError("Verification token is missing");
        setLoading(false);
        return;
      }

      setToken(emailToken);

      try {
        const response = await axios.get(`/customer/verify-email?token=${emailToken}`);
        
        if (response.data.success) {
          setVerified(true);
          // Store token in localStorage
          localStorage.setItem("token", response.data.token);
          
          toast({
            title: "✅ Email Verified",
            description: "Your email has been verified successfully! You are now logged in.",
          });

          // Redirect to browse page after 2 seconds
          setTimeout(() => {
            navigate("/browse");
          }, 2000);
        }
      } catch (err: any) {
        const errorMsg = 
          err.response?.data?.errors?.message ||
          err.response?.data?.message ||
          "Failed to verify email. The link may have expired.";
        
        setError(errorMsg);
        
        toast({
          title: "❌ Verification Failed",
          description: errorMsg,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyEmailToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader className="h-12 w-12 animate-spin text-primary" />
                <p className="text-center text-muted-foreground">
                  Verifying your email address...
                </p>
              </div>
            ) : verified ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">Email Verified!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your email has been verified successfully. You are now logged in.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Redirecting to browse page...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">Verification Failed</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
                <div className="space-y-2 w-full">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate("/signup")}
                  >
                    Try Signing Up Again
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate("/login")}
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default VerifyEmail;
