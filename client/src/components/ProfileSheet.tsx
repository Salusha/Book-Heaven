import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader, LogOut } from "lucide-react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  avatar?: {
    url: string;
  };
}

interface ProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileSheet = ({ open, onOpenChange }: ProfileSheetProps) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || "";

  useEffect(() => {
    if (!open) return;

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/customer/me`, {
          headers: { "auth-token": token },
        });

        const userData =
          res.data?.response?.data?.customer ||
          res.data?.user ||
          res.data?.data?.customer;

        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [open, token, apiBaseUrl]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    onOpenChange(false);
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[350px] sm:w-[400px] overflow-y-auto">
        {!token ? (
          // Not Logged In State
          <div className="space-y-4 mt-6">
            <SheetTitle>Welcome</SheetTitle>
            <p className="text-sm text-muted-foreground">
              To access account and manage orders
            </p>
            <Button className="w-full" onClick={() => handleNavigate("/login")}>
              LOGIN / SIGNUP
            </Button>

            <Separator className="my-6" />

            <div className="space-y-2">
              <button
                onClick={() => handleNavigate("/orders")}
                className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-2 transition-colors"
              >
                Orders
              </button>
              <button
                onClick={() => handleNavigate("/wishlist")}
                className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-2 transition-colors"
              >
                Wishlist
              </button>
              <button
                onClick={() => handleNavigate("/cart")}
                className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-2 transition-colors"
              >
                Cart
              </button>
              <button
                onClick={() => handleNavigate("/browse")}
                className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-2 transition-colors"
              >
                Browse Books
              </button>
              <button
                onClick={() => handleNavigate("/contact")}
                className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-2 transition-colors"
              >
                Contact Us
              </button>
              <button
                onClick={() => handleNavigate("/saved-addresses")}
                className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-2 transition-colors"
              >
                Saved Addresses
              </button>
            </div>
          </div>
        ) : loading ? (
          // Loading State
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <Loader className="h-5 w-5 animate-spin" />
              <p className="text-sm text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        ) : user ? (
          // Logged In State
          <div className="space-y-6 mt-5">
            <div>
              <SheetTitle>My Account</SheetTitle>
            </div>

            {/* Avatar & Basic Info */}
            <div className="flex items-center justify-start gap-4">
              <div className="flex-shrink-0">
                {user.avatar?.url && user.avatar.url !== "ThisisSecureUrl" ? (
                  <img
                    src={user.avatar.url}
                    alt={user.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl">
                    {getInitials(user.name)}
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="font-semibold text-lg">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <Separator />

            {/* Account Options */}
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Account</h3>
              <button
                onClick={() => handleNavigate("/account")}
                className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
              >
                View Full Profile
              </button>
              <button
                onClick={() => handleNavigate("/orders")}
                className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
              >
                Orders
              </button>
              <button
                onClick={() => handleNavigate("/wishlist")}
                className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
              >
                Wishlist
              </button>
              <button
                onClick={() => handleNavigate("/cart")}
                className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
              >
                Cart
              </button>
            </div>

            <Separator />

            {/* Settings */}
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Settings</h3>
              <button
                onClick={() => handleNavigate("/saved-addresses")}
                className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
              >
                Saved Addresses
              </button>
              <button
                onClick={() => handleNavigate("/contact")}
                className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
              >
                Contact Us
              </button>
            </div>

            <Separator />

            {/* Logout Button */}
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSheet;
