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

  const handleAddToCart = (product, selectedQuantity) => {
    if (product?.quantity === 0 || selectedQuantity < 1) {
      return;
    }
    // Assume product.price is in USD; if Firestore prices are in GHS, convert:
    // const exchangeRate = 0.064; // 1 GHS = 0.064 USD
    // const usdPrice = product.price * exchangeRate;
    const cartItem = {
      id: product.id,
      title: product.title,
      quantity: selectedQuantity,
      price: product.price, // Price in USD
      imageUrl: product.imageUrl,
    };
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item
        );
      }
      return [...prevCart, cartItem];
    });
    console.log(
      `Added to cart: ${
        product.title
      }, Quantity: ${selectedQuantity}, Price: $${product.price.toFixed(2)}`
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
