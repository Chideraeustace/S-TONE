import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedThickness, setSelectedThickness] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { handleAddToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "s-tone-products", productId));
        if (productDoc.exists()) {
          const productData = { id: productDoc.id, ...productDoc.data() };
          // Validate and set defaults
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
          productData.price =
            typeof productData.price === "number" ? productData.price : 0;
          productData.images =
            Array.isArray(productData.images) && productData.images.length > 0
              ? productData.images
              : [{ url: "https://via.placeholder.com/150" }];
          productData.colors = Array.isArray(productData.colors)
            ? productData.colors
            : [];
          productData.length = Array.isArray(productData.length)
            ? productData.length
            : [];
          productData.size = Array.isArray(productData.size)
            ? productData.size
            : [];
          productData.style = Array.isArray(productData.style)
            ? productData.style
            : [];
          productData.thickness = Array.isArray(productData.thickness)
            ? productData.thickness
            : [];
          // Set default selections
          setSelectedColor(productData.colors[0] || "");
          setSelectedLength(productData.length[0] || "");
          setSelectedSize(productData.size[0] || "");
          setSelectedStyle(productData.style[0] || "");
          setSelectedThickness(productData.thickness[0] || "");
          setProduct(productData);
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

  const handleAddToCartClick = () => {
    if (!product || product.quantity === 0) return;

    const result = handleAddToCart({
      product,
      selectedQuantity,
      selectedColor,
      selectedLength,
      selectedSize,
      selectedStyle,
      selectedThickness,
    });

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success(`${product.title} added to cart!`);
    }
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-cream-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#4A5D23]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-cream-100 flex items-center justify-center">
        <div className="p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
          <svg
            className="w-5 h-5 mr-2"
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
          <span className="text-base font-serif">
            {error || "Product not found"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-[#F5F5F5] to-cream-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden md:flex">
          {/* Product Image Section */}
          <div className="md:w-1/2 p-4 flex flex-col items-center justify-center bg-white">
            <img
              src={
                product.images[currentImageIndex]?.url ||
                "https://via.placeholder.com/150"
              }
              alt={product.title}
              className="w-full h-64 object-contain rounded-lg transition-transform duration-300 hover:scale-105"
            />
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    className={`w-16 h-16 object-contain rounded-md cursor-pointer border-2 ${
                      currentImageIndex === index
                        ? "border-[#4A5D23]"
                        : "border-gray-200"
                    } hover:border-[#4A5D23] transition-all duration-300`}
                    onClick={() => handleImageChange(index)}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Product Details Section */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-2 tracking-tight">
                {product.title}
              </h1>
              <p className="text-lg font-bold text-[#4A5D23] mb-4 font-sans">
                ₵{product.price.toFixed(2)}
              </p>
              <p className="text-gray-600 text-xs leading-relaxed mb-4 font-sans line-clamp-4">
                {product.description}
              </p>
              {/* Product Status */}
              <div
                className={`flex items-center text-xs font-semibold mb-4 ${
                  product.quantity === 0
                    ? "text-red-600"
                    : product.quantity <= 5
                    ? "text-yellow-600"
                    : "text-[#4A5D23]"
                } font-sans`}
              >
                {product.quantity === 0
                  ? "Sold Out"
                  : product.quantity <= 5
                  ? "Limited Stock"
                  : `In Stock: ${product.quantity}`}
              </div>
              {/* Attribute Selections */}
              {product.colors.length > 0 && (
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-800 block mb-1 font-sans">
                    Color:
                  </label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5D23] bg-white text-gray-700 text-xs transition-all duration-300"
                  >
                    {product.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {product.length.length > 0 && (
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-800 block mb-1 font-sans">
                    Length:
                  </label>
                  <select
                    value={selectedLength}
                    onChange={(e) => setSelectedLength(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5D23] bg-white text-gray-700 text-xs transition-all duration-300"
                  >
                    {product.length.map((len) => (
                      <option key={len} value={len}>
                        {len} mm
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {product.size.length > 0 && (
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-800 block mb-1 font-sans">
                    Size:
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5D23] bg-white text-gray-700 text-xs transition-all duration-300"
                  >
                    {product.size.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {product.style.length > 0 && (
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-800 block mb-1 font-sans">
                    Style:
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5D23] bg-white text-gray-700 text-xs transition-all duration-300"
                  >
                    {product.style.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {product.thickness.length > 0 && (
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-800 block mb-1 font-sans">
                    Thickness:
                  </label>
                  <select
                    value={selectedThickness}
                    onChange={(e) => setSelectedThickness(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5D23] bg-white text-gray-700 text-xs transition-all duration-300"
                  >
                    {product.thickness.map((thickness) => (
                      <option key={thickness} value={thickness}>
                        {thickness} mm
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Quantity Selection */}
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-800 block mb-1 font-sans">
                  Quantity:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setSelectedQuantity((prev) => Math.max(1, prev - 1))
                    }
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                    disabled={selectedQuantity <= 1 || product.quantity === 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={selectedQuantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.quantity}
                    className="w-12 h-8 text-center border-2 border-gray-200 rounded-lg focus:border-[#4A5D23] focus:ring-1 focus:ring-[#4A5D23] transition-all text-xs"
                    disabled={product.quantity === 0}
                  />
                  <button
                    onClick={() =>
                      setSelectedQuantity((prev) =>
                        Math.min(product.quantity, prev + 1)
                      )
                    }
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
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
              onClick={handleAddToCartClick}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-full font-medium text-xs transition-all transform hover:scale-105 ${
                product.quantity === 0 || selectedQuantity < 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#4A5D23] text-white hover:bg-[#3A4A1C] shadow-md"
              }`}
              disabled={product.quantity === 0 || selectedQuantity < 1}
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
