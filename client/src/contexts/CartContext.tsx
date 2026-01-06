import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

interface CartContextValue {
  cartIds: Set<string>;
  cartQuantities: Map<string, number>;
  isInCart: (productId: string) => boolean;
  getQuantity: (productId: string) => number;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());
  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || "";

  const refreshCart = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setIds(new Set());
      setQuantities(new Map());
      return;
    }
    try {
      const res = await axios.get(`${apiBaseUrl}/api/cart`, {
        headers: { "auth-token": token },
      });
      const set = new Set<string>();
      const quantityMap = new Map<string, number>();
      for (const item of res.data.cartItems || []) {
        const id = item?.product?._id;
        if (id) {
          set.add(id);
          quantityMap.set(id, (quantityMap.get(id) || 0) + 1);
        }
      }
      setIds(set);
      setQuantities(quantityMap);
    } catch (err) {
      console.error("Failed to refresh cart:", err);
      setIds(new Set());
      setQuantities(new Map());
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
    cartQuantities: quantities,
    isInCart: (pid: string) => ids.has(pid),
    getQuantity: (pid: string) => quantities.get(pid) || 0,
    addToCart: (pid: string) => {
      setIds(prev => new Set([...prev, pid]));
      setQuantities(prev => new Map(prev).set(pid, (prev.get(pid) || 0) + 1));
    },
    removeFromCart: (pid: string) => {
      const next = new Set(ids);
      next.delete(pid);
      setIds(next);
      const quantMap = new Map(quantities);
      quantMap.delete(pid);
      setQuantities(quantMap);
    },
    updateQuantity: (pid: string, quantity: number) => {
      if (quantity <= 0) {
        const next = new Set(ids);
        next.delete(pid);
        setIds(next);
        const quantMap = new Map(quantities);
        quantMap.delete(pid);
        setQuantities(quantMap);
      } else {
        setQuantities(prev => new Map(prev).set(pid, quantity));
      }
    },
    refreshCart,
  }), [ids, quantities]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
