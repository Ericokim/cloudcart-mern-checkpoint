import { useMemo, useState } from "react";

export function useCart() {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart((items) => {
      const existingItem = items.find((item) => item.productId === product._id);

      if (existingItem) {
        return items.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }

      return [
        ...items,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: 1
        }
      ];
    });
  }

  function clearCart() {
    setCart([]);
  }

  function removeFromCart(productId) {
    setCart((items) => items.filter((item) => item.productId !== productId));
  }

  function updateQuantity(productId, quantity) {
    setCart((items) =>
      items
        .map((item) => {
          if (item.productId !== productId) {
            return item;
          }

          return {
            ...item,
            quantity: Math.min(quantity, item.stock)
          };
        })
        .filter((item) => item.quantity >= 1)
    );
  }

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  return { addToCart, cart, clearCart, removeFromCart, total, updateQuantity };
}
