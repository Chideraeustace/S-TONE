import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { FaShoppingCart, FaSpinner } from "react-icons/fa";
import { useCart } from "./CartContext"; // Import the useCart hook

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { handleAddToCart } = useCart(); // Use the context's handleAddToCart

  const colorMap = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    black: "bg-gray-800",
    white: "bg-gray-200",
    silver: "bg-gray-400",
    gold: "bg-yellow-500",
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "lumixing-product", productId));
        if (productDoc.exists()) {
          const productData = { id: productDoc.id, ...productDoc.data() };
          productData.colors = Array.isArray(productData.colors)
            ? productData.colors
            : [];
          productData.quantity =
            typeof productData.quantity === "number" ? productData.quantity : 0;
          productData.title =
            typeof productData.title === "string"
              ? productData.title
              : "Untitled Product";
          productData.description =
            typeof productData.description === "string"
              ? productData.description
              : "No description available";
          productData.imageUrl =
            typeof productData.imageUrl === "string"
              ? productData.imageUrl
              : "https://via.placeholder.com/150";
          productData.price =
            typeof productData.price === "number" ? productData.price : 0;
          setProduct(productData);
          setSelectedColor(productData.colors[0] || "");
          setLoading(false);
        } else {
          setError(`No product found for ID: ${productId}`);
          setLoading(false);
        }
      } catch (err) {
        setError(`Failed to fetch product details: ${err.message}`);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      setError("No product ID provided in the URL");
      setLoading(false);
    }
  }, [productId]);

  const handleQuantityChange = (event) => {
    const value = Math.max(
      1,
      Math.min(Number(event.target.value), product?.quantity || 1)
    );
    setSelectedQuantity(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 bg-red-100 text-red-800 rounded-xl flex items-center shadow-lg">
          <svg
            className="w-8 h-8 mr-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-lg font-medium">
            {error || "Product not found"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden md:flex">
          {/* Product Image Section */}
          <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg"
            />
          </div>
          {/* Product Details Section */}
          <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                ${product.price.toFixed(2)}
              </p>
              {/* If Firestore prices are in GHS, convert to USD here:
              <p className="text-2xl font-bold text-blue-600 mb-4">
                ${(product.price * 0.064).toFixed(2)}
              </p>
              */}
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                {product.description}
              </p>
              {/* Product Status */}
              <div
                className={`flex items-center text-sm font-semibold mb-6 ${
                  product.quantity === 0
                    ? "text-red-600"
                    : product.quantity <= 5
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {product.quantity === 0
                  ? "Sold Out"
                  : product.quantity <= 5
                  ? "Limited Stock"
                  : `In Stock: ${product.quantity}`}
              </div>
              {/* Color Selection */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-900 block mb-2">
                  Color:
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.length > 0 ? (
                    product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform duration-200 transform hover:scale-110 ${
                          selectedColor === color
                            ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2"
                            : "border-gray-300"
                        } ${colorMap[color.toLowerCase()] || "bg-gray-400"}`}
                        title={color.charAt(0).toUpperCase() + color.slice(1)}
                        disabled={product.quantity === 0}
                      ></button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No colors available</p>
                  )}
                </div>
              </div>
              {/* Quantity Selection */}
              <div className="mb-8">
                <label className="text-sm font-medium text-gray-900 block mb-2">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setSelectedQuantity((prev) => Math.max(1, prev - 1))
                    }
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedQuantity <= 0 || product.quantity === 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={selectedQuantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.quantity}
                    className="w-16 h-10 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    disabled={product.quantity === 0}
                  />
                  <button
                    onClick={() =>
                      setSelectedQuantity((prev) =>
                        Math.min(product.quantity, prev + 1)
                      )
                    }
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      selectedQuantity >= product.quantity ||
                      product.quantity === 0
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            {/* Add to Cart Button */}
            <button
              onClick={() =>
                handleAddToCart(product, selectedColor, selectedQuantity)
              }
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                product.quantity === 0 || !selectedColor || selectedQuantity < 1
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
              }`}
              disabled={
                product.quantity === 0 || !selectedColor || selectedQuantity < 1
              }
              aria-label={`Add ${product.title} to cart`}
            >
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
