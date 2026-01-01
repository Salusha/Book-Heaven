import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface WishlistContextType {
  wishlistIds: Set<string>;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set<string>());
  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || "";

  const refreshWishlist = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      // No token means user is logged out - clear wishlist
      setWishlistIds(new Set());
      return;
    }

    try {
      const response = await axios.get(`${apiBaseUrl}/api/wishlist/getwishlistdata`, {
        headers: { "auth-token": token },
      });
      const items = response.data.wishlistItems || [];
      const ids = new Set<string>(
        items
          .map((item: any) => item.product?._id)
          .filter((id: unknown): id is string => typeof id === "string"),
      );
      setWishlistIds(ids);
      console.log("Wishlist refreshed for current user, items:", ids.size);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      // On auth error, clear wishlist
      if ((err as any)?.response?.status === 401) {
        setWishlistIds(new Set<string>());
      }
    }
  };

  useEffect(() => {
    refreshWishlist();

    // Listen for storage changes (login/logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === null) {
        refreshWishlist();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isInWishlist = (productId: string) => wishlistIds.has(productId);

  const addToWishlist = (productId: string) => {
    setWishlistIds((prev) => new Set(prev).add(productId));
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, isInWishlist, addToWishlist, removeFromWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
