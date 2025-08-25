import React, { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]); // items: { productId, title, price(number), quantity }

  const add = (product, qty = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.productId === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
        return copy;
      }
      return [...prev, { productId: product.id, title: product.title, price: Number(product.price), quantity: qty }];
    });
  };

  const updateQty = (productId, quantity) => {
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i));
  };

  const remove = (productId) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const clear = () => setCart([]);

  const total = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart]);

  const value = useMemo(() => ({ cart, add, updateQty, remove, clear, total }), [cart, total]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = { children: PropTypes.node };

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
