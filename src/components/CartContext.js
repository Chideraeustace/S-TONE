import { createContext, useContext, useState, useEffect } from "react";

// Create Cart Context
const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on initialization
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product, selectedColor, selectedQuantity) => {
    if (product?.quantity === 0 || !selectedColor || selectedQuantity < 1) {
      return;
    }
    const cartItem = {
      id: product.id,
      title: product.title,
      color: selectedColor,
      quantity: selectedQuantity,
      price: product.price,
      imageUrl: product.imageUrl,
    };
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.color === selectedColor
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.color === selectedColor
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item
        );
      }
      return [...prevCart, cartItem];
    });
    console.log(
      `Added to cart: ${product.title}, Color: ${selectedColor}, Quantity: ${selectedQuantity}`
    );
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        handleAddToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the Cart Context
export const useCart = () => useContext(CartContext);
