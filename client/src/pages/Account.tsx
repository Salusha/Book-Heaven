import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader, User, Mail, Calendar, LogOut } from "lucide-react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  avatar?: {
    url: string;
  };
}

const Account = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || "";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/customer/me`, {
          headers: { "auth-token": token },
        });
        
        // Handle the response structure: response.data.customer or response.data.user
        const userData = res.data?.response?.data?.customer || res.data?.user || res.data?.data?.customer;
        
        if (userData) {
          setUser(userData);
        } else {
          console.error("Unexpected response structure:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, navigate, apiBaseUrl]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  // Generate avatar from initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!token) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-2">
            <Loader className="h-5 w-5 animate-spin" />
            <p>Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold mb-2">My Account</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || "User"}!</p>
        </div>

        {/* Main Profile Card */}
        {user && (
          <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                  {user.avatar?.url && user.avatar.url !== "ThisisSecureUrl" ? (
                    <img
                      src={user.avatar.url}
                      alt={user.name}
                      className="h-24 w-24 rounded-full object-cover border-4 border-primary"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-4 border-primary">
                      {getInitials(user.name)}
                    </div>
                  )}
                </div>

                {/* Profile Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Full Name</span>
                    </div>
                    <p className="text-lg font-semibold">{user.name}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>Email Address</span>
                    </div>
                    <p className="text-lg font-semibold break-all">{user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Member Since</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Account Status</span>
                    </div>
                    <p className="text-lg font-semibold text-green-600">Active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <Button variant="outline" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Account;
