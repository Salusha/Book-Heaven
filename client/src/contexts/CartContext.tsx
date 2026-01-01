import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

interface CartContextValue {
  cartIds: Set<string>;
  isInCart: (productId: string) => boolean;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || "";

  const refreshCart = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setIds(new Set());
      return;
    }
    try {
      const res = await axios.get(`${apiBaseUrl}/api/cart`, {
        headers: { "auth-token": token },
      });
      const set = new Set<string>();
      for (const item of res.data.cartItems || []) {
        const id = item?.product?._id;
        if (id) set.add(id);
      }
      setIds(set);
    } catch (err) {
      console.error("Failed to refresh cart:", err);
      setIds(new Set());
    }
  };

  useEffect(() => {
    refreshCart();
    const onStorage = () => refreshCart();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<CartContextValue>(() => ({
    cartIds: ids,
    isInCart: (pid: string) => ids.has(pid),
    addToCart: (pid: string) => setIds(prev => new Set([...prev, pid])),
    removeFromCart: (pid: string) => {
      const next = new Set(ids);
      next.delete(pid);
      setIds(next);
    },
    refreshCart,
  }), [ids]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
