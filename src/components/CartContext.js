import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product, selectedQuantity, selectedAttributes) => {
    if (product?.quantity === 0 || selectedQuantity < 1) {
      return;
    }
    const cartItem = {
      id: product.id,
      title: product.title,
      quantity: selectedQuantity,
      price: product.price, // Price in GHS
      images: product.images,
      selectedColor: selectedAttributes?.selectedColor || "N/A",
      selectedLength: selectedAttributes?.selectedLength || "N/A",
      selectedSize: selectedAttributes?.selectedSize || "N/A",
      selectedStyle: selectedAttributes?.selectedStyle || "N/A",
      selectedThickness: selectedAttributes?.selectedThickness || "N/A",
    };
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor === cartItem.selectedColor &&
          item.selectedLength === cartItem.selectedLength &&
          item.selectedSize === cartItem.selectedSize &&
          item.selectedStyle === cartItem.selectedStyle &&
          item.selectedThickness === cartItem.selectedThickness
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id &&
          item.selectedColor === cartItem.selectedColor &&
          item.selectedLength === cartItem.selectedLength &&
          item.selectedSize === cartItem.selectedSize &&
          item.selectedStyle === cartItem.selectedStyle &&
          item.selectedThickness === cartItem.selectedThickness
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item
        );
      }
      return [...prevCart, cartItem];
    });
    console.log(
      `Added to cart: ${
        product.title
      }, Quantity: ${selectedQuantity}, Price: ₵${product.price.toFixed(
        2
      )}, Attributes:`,
      selectedAttributes
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

export const useCart = () => useContext(CartContext);
