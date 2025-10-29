// src/context/CartContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  /**
   * Add to cart – accepts full payload from ProductDetails
   */
  const handleAddToCart = useCallback(
    ({
      product,
      selectedQuantity,
      selectedColor,
      selectedLength,
      selectedSize,
      selectedStyle,
      selectedThickness,
    }) => {
      if (!product || product.quantity === 0 || selectedQuantity < 1) {
        return { success: false, message: "Invalid product or quantity" };
      }

      const qty = Math.min(selectedQuantity, product.quantity);

      // Validate required attributes
      const missing = [];
      if (product.colors?.length > 0 && !selectedColor) missing.push("Color");
      if (product.length?.length > 0 && !selectedLength) missing.push("Length");
      if (product.size?.length > 0 && !selectedSize) missing.push("Size");
      if (product.style?.length > 0 && !selectedStyle) missing.push("Style");
      if (product.thickness?.length > 0 && !selectedThickness)
        missing.push("Thickness");

      if (missing.length > 0) {
        return { success: false, message: `Select: ${missing.join(", ")}` };
      }

      const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: qty,
        maxQuantity: product.quantity,
        images: product.images || [],
        selectedColor: selectedColor || "N/A",
        selectedLength: selectedLength || "N/A",
        selectedSize: selectedSize || "N/A",
        selectedStyle: selectedStyle || "N/A",
        selectedThickness: selectedThickness || "N/A",
      };

      setCart((prev) => {
        const existing = prev.find(
          (i) =>
            i.id === cartItem.id &&
            i.selectedColor === cartItem.selectedColor &&
            i.selectedLength === cartItem.selectedLength &&
            i.selectedSize === cartItem.selectedSize &&
            i.selectedStyle === cartItem.selectedStyle &&
            i.selectedThickness === cartItem.selectedThickness
        );

        if (existing) {
          const newQty = Math.min(existing.quantity + qty, product.quantity);
          return prev.map((i) =>
            i === existing ? { ...i, quantity: newQty } : i
          );
        }

        return [...prev, cartItem];
      });

      return { success: true };
    },
    []
  );

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQty) => {
    const qty = Math.max(1, newQty);
    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.min(qty, item.maxQuantity || qty) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        handleAddToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
